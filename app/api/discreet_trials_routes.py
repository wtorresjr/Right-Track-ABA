from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Discreet_Trial
from datetime import time, datetime


discreet_trials_bp = Blueprint("my-discreet-trials", __name__)


@discreet_trials_bp.route("/", methods=["GET"])
@login_required
def get_all_discreet_trials():
    pass
