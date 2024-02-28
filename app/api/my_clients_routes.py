from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Client, Daily_Chart, Interval, Discreet_Trial, Trial
from sqlalchemy.orm import joinedload
from sqlalchemy import func
from datetime import date

my_clients = Blueprint("my-clients", __name__)

# Get all clients for logged in therapist


@my_clients.route("/", methods=["GET"])
@login_required
def get_clients():

    clients = Client.query.filter_by(therapist_id=current_user.id).all()

    client_info = {"Total_Clients": 0, "Clients": []}

    for client in clients:
        this_client = client.to_dict()
        this_client["Daily_Chart_Count"] = len(client.daily_charts)
        total_interval_ratings = (
            sum(
                interval.interval_rating
                for daily_chart in client.daily_charts
                for interval in daily_chart.intervals
            )
            if client.daily_charts
            else 0
        )
        total_intervals = (
            sum(len(daily_chart.intervals) for daily_chart in client.daily_charts)
            if client.daily_charts
            else 0
        )
        if total_intervals == 0:
            avg_interval_p_chart = 0
            this_client["Chart_Avg"] = round(avg_interval_p_chart, 2)
        else:
            avg_interval_p_chart = total_interval_ratings / total_intervals
            this_client["Chart_Avg"] = round(avg_interval_p_chart, 2)

        this_client["DT_Count"] = len(client.discreet_trials)

        total_trial_score = sum(
            trial.trial_score
            for discreet_trial in client.discreet_trials
            for trial in discreet_trial.trials
        )
        total_trial_count = sum(
            trial.trial_count
            for discreet_trial in client.discreet_trials
            for trial in discreet_trial.trials
        )

        if total_trial_count == 0:
            this_client["DT_Avg_Mastery"] = 0
        else:
            this_client["DT_Avg_Mastery"] = round(
                (100 / total_trial_count) * total_trial_score, 1
            )

        client_info["Clients"].append(this_client)
        client_info["Total_Clients"] += 1

    client_list = sorted(
        client_info["Clients"], key=lambda x: x["created_at"], reverse=True
    )

    return (
        jsonify(
            {"Clients": client_list, "Total_Clients": client_info["Total_Clients"]}
        ),
        200,
    )


# Get client for logged in therapist by client_id


@my_clients.route("/<int:client_id>", methods=["GET"])
@login_required
def get_client_by_id(client_id):

    page = int(request.args.get("page"))
    per_page = int(request.args.get("per_page"))

    found_client = (
        Client.query.filter_by(id=client_id)
        .options(joinedload(Client.daily_charts).joinedload(Daily_Chart.intervals))
        .first()
    )

    clients_intervals = (
        db.session.query(Interval)
        .join(Daily_Chart, Interval.chart_id == Daily_Chart.id)
        .filter(Daily_Chart.client_id == client_id)
        .all()
    )

    if not found_client:
        return jsonify({"message": f"No client found with ID {client_id}"}), 404

    valid_client = found_client.to_dict()

    if clients_intervals:
        all_chart_avg_sum = sum(
            interval.interval_rating for interval in clients_intervals
        )
        all_chart_avg = round(all_chart_avg_sum / len(clients_intervals), 2)
    else:
        all_chart_avg = 0

    paginated_charts_avg_totals = 0

    if valid_client["therapist_id"] == current_user.id:
        total_charts = len(found_client.daily_charts)

        # Sort all daily charts based on chart_date in descending order
        sorted_daily_charts = sorted(
            found_client.daily_charts, key=lambda dc: dc.chart_date, reverse=True
        )

        start_idx = 0
        end_idx = 0
        paginated_charts = []

        if page and per_page:
            start_idx = (page - 1) * per_page
            end_idx = start_idx + per_page
            paginated_charts = sorted_daily_charts[start_idx:end_idx]
        else:
            paginated_charts = sorted_daily_charts

        daily_charts = []

        for dc in paginated_charts:
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

            paginated_charts_avg_totals += chart_dict["avgForChart"]

            daily_charts.append(chart_dict)

        # discreet_trials = [dt.to_dict() for dt in found_client.discreet_trials]
        # valid_client["Discreet_Trials"] = discreet_trials

        valid_client["Daily_Charts"] = daily_charts
        valid_client["Incomplete_Charts"] = [
            incChart.to_dict()
            for incChart in found_client.daily_charts
            if not incChart.chart_complete
        ]
        valid_client["Num_Of_Charts"] = total_charts  # Display total number of charts

        if total_charts != 0:
            valid_client["Paginated_Charts_Avg"] = round(
                paginated_charts_avg_totals / len(daily_charts), 2
            )
            valid_client["All_Charts_Avg"] = all_chart_avg
        else:
            valid_client["Paginated_Charts_Avg"] = 0
            valid_client["All_Charts_Avg"] = 0

        return jsonify(valid_client)

    else:
        return jsonify({"message": "Forbidden, client is not registered to you."}), 403


# Delete client by id


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
        # Date of birth split date then
        dob = client_data.get("dob").split("-")

        new_client = Client(
            first_name=client_data.get("first_name"),
            last_name=client_data.get("last_name"),
            guardian_email=client_data.get("guardian_email"),
            client_notes=client_data.get("client_notes"),
            dob=date(int(dob[0]), int(dob[1]), int(dob[2])),
            therapist_id=current_user.id,
        )

        db.session.add(new_client)
        db.session.commit()

        return jsonify(new_client.to_dict()), 201

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"})


# Edit client


from datetime import date

# ...


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

        if "dob" in user_edit_data:
            dob = user_edit_data["dob"].split("-")
            user_edit_data["dob"] = date(int(dob[0]), int(dob[1]), int(dob[2]))

        for [key, item] in user_edit_data.items():
            setattr(client_to_edit, key, item)

        db.session.commit()

        return client_to_edit.to_dict()

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 403
