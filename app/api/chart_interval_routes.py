from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Daily_Chart, Client, Interval

chart_interval_bp = Blueprint("my-daily-charts/new-interval", __name__)


@chart_interval_bp.route("/", methods=["GET"])
@login_required
def add_new_interval():
    return jsonify({"Route": "Reached"})
