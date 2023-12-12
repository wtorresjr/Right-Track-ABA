from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Trial
from datetime import time, datetime


trials_bp = Blueprint("my-trials", __name__)


@trials_bp.route("/<int:trial_id>", methods=["GET"])
@login_required
def get_trials_by_dt(trial_id):
    return jsonify({"Success": "Route Reached"}), 200
