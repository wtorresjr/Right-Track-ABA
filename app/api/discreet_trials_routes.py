from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Discreet_Trial
from datetime import time, datetime


discreet_trials_bp = Blueprint("my-discreet-trials", __name__)


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
