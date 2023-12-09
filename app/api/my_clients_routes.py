from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import Client

my_clients = Blueprint("my-clients", __name__)

# Get all clients for logged in therapist


@my_clients.route("/", methods=["GET"])
@login_required
def get_clients():
    clients = Client.query.filter_by(therapist_id=current_user.id).all()
    client_list = [client.to_dict() for client in clients]
    return jsonify({"Clients": client_list})


# Get client for logged in therapist by client_id


@my_clients.route("/<int:client_id>", methods=["GET"])
@login_required
def get_client_by_id(client_id):
    found_client = Client.query.get(client_id)

    if not found_client:
        return jsonify({"message": f"No client found with ID {client_id}"})

    found_client = found_client.to_dict()

    if found_client["therapist_id"] == current_user.id:
        return jsonify({"Client": found_client})

    else:
        return jsonify({"message": "Forbidden"})
