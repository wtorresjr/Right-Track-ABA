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
        return jsonify({"Interval": found_interval.to_dict()}), 200

    return (
        jsonify(
            {
                "message": f"Interval ID {interval_id} does not belong to therapist's chart"
            }
        ),
        403,
    )


# Edit an interval by ID


@chart_interval_bp.route("/<int:interval_id>", methods=["PUT"])
@login_required
def edit_interval_by_id(interval_id):
    interval_to_edit = Interval.query.get(interval_id)

    if not interval_to_edit:
        return jsonify({"message": f"Interval ID {interval_id} not found"}), 404

    found_interval = interval_to_edit.to_dict()

    if found_interval["therapist_id"] == current_user.id:
        user_edit_data = request.get_json()

        for [key, item] in user_edit_data.items():
            setattr(interval_to_edit, key, item)

        db.session.commit()

        return jsonify({"Edited_Interval": interval_to_edit.to_dict()}), 200

    return (
        jsonify(
            {
                "message": f"Forbidden, interval {interval_id} does not belong to therapist.`"
            }
        ),
        403,
    )


@chart_interval_bp.route("/<int:interval_id>", methods=["DELETE"])
@login_required
def delete_interval_by_id(interval_id):
    interval_to_delete = Interval.query.get(interval_id)

    if not interval_to_delete:
        return (
            jsonify({"message": f"Interval {interval_to_delete} could not be found"}),
            404,
        )

    found_interval = interval_to_delete.to_dict()

    if found_interval["therapist_id"] == current_user.id:
        db.session.delete(interval_to_delete)
        db.session.commit()
        return (
            jsonify({"Success": f"Interval {interval_id} was deleted."}),
            403,
        )
    return (
        jsonify({"message": f"Interval {interval_id} does not belong to therapist."}),
        403,
    )


@chart_interval_bp.route("/", methods=["POST"])
@login_required
def create_new_interval():
    user_input_data = request.get_json()

    return jsonify({"Route Reach": user_input_data})
