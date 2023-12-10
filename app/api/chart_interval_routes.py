from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Daily_Chart, Client, Interval

chart_interval_bp = Blueprint("interval", __name__)


# Get interval by id


@chart_interval_bp.route("/<int:interval_id>", methods=["GET"])
@login_required
def get_interval_by_id(interval_id):
    found_interval = Interval.query.get(interval_id)

    if not found_interval:
        return jsonify({"message": f"No interval by ID {interval_id} found."}), 404

    the_interval = found_interval.to_dict()

    if the_interval["therapist_id"] == current_user.id:
        return jsonify({"Interval": found_interval.to_dict()})

    return jsonify(
        {"message": f"Interval ID {interval_id} does not belong to therapist's chart"}
    )
