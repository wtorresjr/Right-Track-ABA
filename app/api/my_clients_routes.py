from flask import Blueprint, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from app.models import Client

my_clients = Blueprint("my-clients", __name__)


@my_clients.route("/", methods=["GET"])
def get_clients():
    clients = Client.query.filter_by(therapist_id=current_user.id).all()
    client_list = [client.to_dict() for client in clients]
    return jsonify({"Clients": client_list})
