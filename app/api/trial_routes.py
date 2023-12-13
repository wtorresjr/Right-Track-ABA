from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Trial
from datetime import time, datetime


trials_bp = Blueprint("my-trials", __name__)


# Create new trial


@trials_bp.route("/", methods=["POST"])
@login_required
def create_new_trial():
    user_input_data = request.get_json()

    new_trial = Trial(
        **user_input_data,
        therapist_id=current_user.id,
    )

    db.session.add(new_trial)
    db.session.commit()

    return jsonify({"New_Trial": new_trial.to_dict()})


# Get, Delete, Edit trials


@trials_bp.route("/<int:trial_id>", methods=["GET", "DELETE", "PUT"])
@login_required
def get_trials_by_dt(trial_id):
    found_trial = Trial.query.get(trial_id)

    if not found_trial:
        return jsonify({"message": f"Trial {trial_id} could not be found."}), 404

    trial = found_trial.to_dict()

    if trial["therapist_id"] == current_user.id:
        
        if request.method == "GET":
            return jsonify(found_trial.to_dict()), 200

        if request.method == "DELETE":
            db.session.delete(found_trial)
            db.session.commit()
            return jsonify({"Success": f"Deleted trial {trial_id}"}), 200

        if request.method == "PUT":
            edit_data = request.get_json()

            for [key, item] in edit_data.items():
                setattr(found_trial, key, item)

            db.session.commit()

            return jsonify({"Edited_Trial": found_trial.to_dict()})

    return (
        jsonify({"message": f"Trial {trial_id} does not belong to current user."}),
        403,
    )
