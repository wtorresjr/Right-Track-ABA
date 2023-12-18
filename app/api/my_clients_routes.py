from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Client, Daily_Chart
from sqlalchemy.orm import joinedload
from sqlalchemy import func

my_clients = Blueprint("my-clients", __name__)

# Get all clients for logged in therapist


@my_clients.route("/", methods=["GET"])
@login_required
def get_clients():
    clients = Client.query.filter_by(therapist_id=current_user.id).all()
    client_list = [client.to_dict() for client in clients]
    return jsonify({"Clients": client_list}), 200


# Get client for logged in therapist by client_id


@my_clients.route("/<int:client_id>", methods=["GET"])
@login_required
def get_client_by_id(client_id):
    # found_client = Client.query.get(client_id)

    found_client = (
        Client.query.filter_by(id=client_id)
        .options(joinedload(Client.daily_charts).joinedload(Daily_Chart.intervals))
        .first()
    )

    if not found_client:
        return jsonify({"message": f"No client found with ID {client_id}"}), 404

    valid_client = found_client.to_dict()

    if valid_client["therapist_id"] == current_user.id:
        daily_charts = []

        for dc in found_client.daily_charts:
            total_rating = 0
            chart_dict = dc.to_dict()
            chart_dict["intervals"] = [interval.to_dict() for interval in dc.intervals]
            chart_dict["interval_count"] = len(chart_dict["intervals"])

            total_rating = sum(
                interval["interval_rating"]
                for interval in chart_dict["intervals"]
                if "interval_rating" in interval
            )
            chart_dict["total_rating"] = total_rating

            if chart_dict["interval_count"] > 0:
                avg_rating = total_rating / chart_dict["interval_count"]
            else:
                avg_rating = 0

            chart_dict["avgForChart"] = round(avg_rating, 2)

            daily_charts.append(chart_dict)

        discreet_trials = [dt.to_dict() for dt in found_client.discreet_trials]
        valid_client["Daily_Charts"] = daily_charts
        valid_client["Discreet_Trials"] = discreet_trials

        return jsonify(valid_client)

    else:
        return jsonify({"message": "Forbidden, client is not registered to you."})


# Delete a client by client_id


@my_clients.route("/<int:client_id>", methods=["DELETE"])
@login_required
def delete_client_by_id(client_id):
    client_to_delete = Client.query.get(client_id)

    if not client_to_delete:
        return jsonify({"message": f"No client found by ID {client_id}"}), 404

    found_client = client_to_delete.to_dict()

    if found_client["therapist_id"] == current_user.id:
        db.session.delete(client_to_delete)
        db.session.commit()
        return jsonify({"message": f"Successfully Deleted Client ID {client_id}"})
    else:
        return (
            jsonify({"message": "Forbidden client does not belong to logged in user"}),
            403,
        )


# Create new client


@my_clients.route("/", methods=["POST"])
@login_required
def create_new_client():
    client_data = request.get_json()

    try:
        new_client = Client(
            first_name=client_data.get("first_name"),
            last_name=client_data.get("last_name"),
            guardian_email=client_data.get("guardian_email"),
            therapist_id=current_user.id,
        )

        db.session.add(new_client)
        db.session.commit()

        return jsonify(new_client.to_dict()), 201

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"})


# Edit client


@my_clients.route("/<int:client_id>", methods=["PUT"])
@login_required
def edit_a_client(client_id):
    try:
        client_to_edit = Client.query.get(client_id)

        if not client_to_edit:
            return jsonify({"message": f"No client by ID {client_id}"}), 404

        found_client = client_to_edit.to_dict()

        if not found_client["therapist_id"] == current_user.id:
            return jsonify(
                {"message": "Forbidden, client does not belong to this therapist"}
            )

        user_edit_data = request.get_json()

        for [key, item] in user_edit_data.items():
            setattr(client_to_edit, key, item)

        db.session.commit()

        return client_to_edit.to_dict()

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"})
