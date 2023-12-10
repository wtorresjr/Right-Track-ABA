from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Daily_Chart, Client, Interval

chart_interval_bp = Blueprint("interval", __name__)


@chart_interval_bp.route("/<int:chart_id>", methods=["GET"])
@login_required
def add_new_interval(chart_id):
    all_intervals = Interval.query.filter_by(chart_id=chart_id).all()
    intervals = [interval.to_dict() for interval in all_intervals]
    return jsonify({"Chart_Intervals": intervals})
