from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Daily_Chart


daily_charts_bp = Blueprint("my-daily-charts", __name__)


@daily_charts_bp.route("/", methods=["GET"])
@login_required
def get_all_charts():
    therapist_charts = Daily_Chart.query.filter_by(therapist_id=current_user.id).all()
    chart_list = [chart.to_dict() for chart in therapist_charts]
    if not chart_list:
        return jsonify({"message": "No charts found"}), 404

    return jsonify({"Therapist_Charts": chart_list})
