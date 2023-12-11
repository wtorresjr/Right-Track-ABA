from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Discreet_Trial
from datetime import time, datetime


discreet_trials_bp = Blueprint("my-discreet-trials", __name__)


# Get all therapist created discreet trials


@discreet_trials_bp.route("/", methods=["GET"])
@login_required
def get_all_discreet_trials():
    found_discreet_trials = Discreet_Trial.query.filter_by(
        therapist_id=current_user.id
    ).all()

    if not found_discreet_trials:
        return jsonify({"message", "No discreet trials found"}), 404

    therapist_dts = [dt.to_dict() for dt in found_discreet_trials]

    return jsonify({"Discreet_Trials": therapist_dts})


# Get all therapist created discreet trials by client ID


@discreet_trials_bp.route("/client/<int:client_id>", methods=["GET"])
@login_required
def get_dt_by_client_id(client_id):
    found_client_dts = Discreet_Trial.query.filter_by(
        client_id=client_id, therapist_id=current_user.id
    ).all()

    if not found_client_dts:
        return jsonify(
            {
                "message": "Either client does not exist or does not belong to logged in user."
            }
        )

    client_dts = [dt.to_dict() for dt in found_client_dts]

    return jsonify({"Client_DTs": client_dts})


@discreet_trials_bp.route("/dt-id/<int:dt_id>", methods=["GET"])
@login_required
def get_dt_trials_by_dt_id(dt_id):
    dt_detail_found = Discreet_Trial.query.get(dt_id)

    if not dt_detail_found:
        return jsonify({"message": f"Discreet trial {dt_id} could not be found."}), 404

    return jsonify(dt_detail_found.to_dict())
