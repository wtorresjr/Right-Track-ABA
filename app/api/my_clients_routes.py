from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Client

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
    found_client = Client.query.get(client_id)

    if not found_client:
        return jsonify({"message": f"No client found with ID {client_id}"}), 404

    found_client = found_client.to_dict()

    if found_client["therapist_id"] == current_user.id:
        return jsonify({"Client": found_client})

    else:
        return jsonify({"message": "Forbidden"})


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
