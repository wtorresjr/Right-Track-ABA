from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Discreet_Trial
from datetime import time, datetime


discreet_trials_bp = Blueprint("my-discreet-trials", __name__)


# Get all therapist created discreet trials


@discreet_trials_bp.route("/", methods=["GET"])
@login_required
def get_all_discreet_trials():
    found_discreet_trials = Discreet_Trial.query.filter_by(
        therapist_id=current_user.id
    ).all()

    if not found_discreet_trials:
        return jsonify({"message", "No discreet trials found"}), 404

    therapist_dts = [dt.to_dict() for dt in found_discreet_trials]

    return jsonify({"Discreet_Trials": therapist_dts}), 200


# Get all therapist created discreet trials by client ID


@discreet_trials_bp.route("/client/<int:client_id>", methods=["GET"])
@login_required
def get_dt_by_client_id(client_id):
    found_client_dts = Discreet_Trial.query.filter_by(
        client_id=client_id, therapist_id=current_user.id
    ).all()

    if not found_client_dts:
        return (
            jsonify(
                {
                    "message": "Either client does not exist or does not belong to logged in user."
                }
            ),
            404,
        )

    client_dts = [dt.to_dict() for dt in found_client_dts]

    return jsonify({"Client_DTs": client_dts}), 200


# Get discreet trial and trials by DT ID


@discreet_trials_bp.route("/dt-id/<int:dt_id>", methods=["GET"])
@login_required
def get_dt_trials_by_dt_id(dt_id):
    dt_found = Discreet_Trial.query.get(dt_id)

    if not dt_found:
        return jsonify({"message": f"Discreet trial {dt_id} could not be found."}), 404

    dt_data = dt_found.to_dict()

    if dt_data["therapist_id"] == current_user.id:
        dt_details = {
            "Discreet_Trial": dt_found.to_dict(),
            "Trials": [trial.to_dict() for trial in dt_found.trials],
        }
        return jsonify(dt_details), 200
    else:
        return jsonify({"message": f"Trial does not belong to current user."}), 403


# Delete trial by ID


@discreet_trials_bp.route("/dt-id/<int:dt_id>", methods=["DELETE"])
@login_required
def delete_dt_by_id(dt_id):
    dt_to_delete = Discreet_Trial.query.get(dt_id)
    if not dt_to_delete:
        return (
            jsonify({"message": f"Discreet trial bye {dt_id} could not be found."}),
            404,
        )
    dt_found = dt_to_delete.to_dict()

    if dt_found["therapist_id"] == current_user.id:
        db.session.delete(dt_to_delete)
        db.session.commit()
        return jsonify({"Success": f"Deleted Discreet Trial {dt_id}"}), 201

    return jsonify({"message": f"{dt_id} does not belong to current user."}), 403


# Edit a discreet trial by ID


@discreet_trials_bp.route("/dt-id/<int:dt_id>", methods=["PUT"])
@login_required
def edit_dt_by_id(dt_id):
    dt_to_edit = Discreet_Trial.query.get(dt_id)

    if not dt_to_edit:
        return jsonify({"message": f"ID {dt_id} could not be found"}), 404

    dt_found = dt_to_edit.to_dict()

    if dt_found["therapist_id"] == current_user.id:
        user_edit_data = request.get_json()

        trial_date = datetime.strptime(user_edit_data["trial_date"], "%Y,%m,%d").date()

        user_edit_data["trial_date"] = trial_date

        for [key, item] in user_edit_data.items():
            setattr(dt_to_edit, key, item)

        db.session.commit()
        return jsonify(dt_to_edit.to_dict()), 200

    return jsonify({"message": f"ID {dt_id} does not belong to current user."})


@discreet_trials_bp.route("/", methods=["POST"])
@login_required
def create_new_dt():
    user_input = request.get_json()
    trial_date = datetime.strptime(user_input["trial_date"], "%Y,%m,%d").date()
    user_input["trial_date"] = trial_date

    new_dt = Discreet_Trial(
        **user_input,
        therapist_id=current_user.id,
    )
    db.session.add(new_dt)
    db.session.commit()

    return jsonify({"New_Discreet_Trial": new_dt.to_dict()}), 201
