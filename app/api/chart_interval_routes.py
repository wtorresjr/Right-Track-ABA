from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Interval, Daily_Chart
from datetime import time, datetime
from sqlalchemy.orm import joinedload

chart_interval_bp = Blueprint("interval", __name__)


# Get interval by id

# Get Interval by Client_Id

from collections import Counter


from collections import defaultdict


@chart_interval_bp.route("/<int:client_id>", methods=["GET"])
@login_required
def get_intervals_by_client_id(client_id):
    found_intervals = (
        Interval.query.join(Daily_Chart)
        .filter(Daily_Chart.client_id == client_id)
        .options(joinedload(Interval.chart))
        .all()
    )

    if not found_intervals:
        return (
            jsonify({"message": f"No intervals found for client id: {client_id}"}),
            404,
        )

    # Create a defaultdict to store behaviors and their counts for each chart_date
    behavior_dict = defaultdict(dict)

    for interval in found_intervals:
        chart_date = interval.chart.chart_date
        problem_behaviors = interval.interval_tags.items()

        # Update the behavior_dict with the occurrences for chart_date
        for behavior, value in problem_behaviors:
            behavior_dict[chart_date][behavior] = (
                behavior_dict[chart_date].get(behavior, 0) + value
            )

    # Convert the behavior_dict to a list of dictionaries
    behavior_counts_by_date = [
        {"chart_date": chart_date, "behaviors": behaviors}
        for chart_date, behaviors in behavior_dict.items()
    ]

    # Sort the list by chart_date
    sorted_behavior_counts = sorted(
        behavior_counts_by_date,
        key=lambda x: datetime.strptime(x["chart_date"], "%Y-%m-%d"),
        reverse=True,
    )

    return jsonify(sorted_behavior_counts)


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


# Delete interval by ID


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
            200,
        )

    return (
        jsonify({"message": f"Interval {interval_id} does not belong to therapist."}),
        403,
    )


# Create interval by ID


@chart_interval_bp.route("/", methods=["POST"])
@login_required
def create_new_interval():
    user_input_data = request.get_json()

    start_time_str = user_input_data["start_interval"]
    end_time_str = user_input_data["end_interval"]
    start_interval = time.fromisoformat(start_time_str)
    end_interval = time.fromisoformat(end_time_str)

    new_interval = Interval(
        therapist_id=current_user.id,
        chart_id=user_input_data["chart_id"],
        start_interval=start_interval,
        end_interval=end_interval,
        interval_notes=user_input_data["interval_notes"],
        interval_rating=user_input_data["interval_rating"],
        interval_tags=user_input_data["interval_tags"],
        activity=user_input_data["activity"],
    )

    db.session.add(new_interval)
    db.session.commit()

    return jsonify({"New_Interval_Created": new_interval.to_dict()})
