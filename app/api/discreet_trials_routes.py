from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Discreet_Trial, Trial
from datetime import time, datetime
from sqlalchemy.orm import joinedload


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

    page = int(request.args.get("page"))
    per_page = int(request.args.get("per_page"))

    found_client_dts = Discreet_Trial.query.filter_by(
        client_id=client_id, therapist_id=current_user.id
    )

    if not found_client_dts:
        return (
            jsonify([]),
            200,
        )

    client_dts = []

    for dt in found_client_dts:

        dt_dict = dt.to_dict()

        trials_info = [trial.to_dict() for trial in dt.trials]

        if not len(trials_info):
            dt_dict["trials_score"] = 0
            dt_dict["trials_count"] = 0
            dt_dict["trials_avg"] = 0
        else:
            dt_dict["trials_score"] = sum(trial["trial_score"] for trial in trials_info)
            dt_dict["trials_count"] = sum(trial["trial_count"] for trial in trials_info)

            dt_dict["trials_avg"] = round(
                100
                / sum(trial["trial_count"] for trial in trials_info)
                * sum(trial["trial_score"] for trial in trials_info),
                1,
            )

        client_dts.append(dt_dict)

    sorted_dts = sorted(client_dts, key=lambda dt: dt["trial_date"], reverse=True)

    paginated_dts = []

    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    paginated_dts = sorted_dts[start_idx:end_idx]

    return (
        jsonify(paginated_dts),
        200,
    )


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

        trial_date = datetime.strptime(user_edit_data["trial_date"], "%Y-%m-%d").date()

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

    new_dt = Discreet_Trial(
        trial_date=datetime.strptime(user_input["trial_date"], "%Y-%m-%d").date(),
        client_id=user_input["client_id"],
        program_name=user_input["program_name"],
        program_notes=user_input["program_notes"],
        therapist_id=current_user.id,
    )

    db.session.add(new_dt)
    db.session.commit()

    return jsonify({"New_Discreet_Trial": new_dt.to_dict()}), 201


# Add New Trial to DT


@discreet_trials_bp.route("/add-trial/dt-id/<int:dt_id>", methods=["POST"])
@login_required
def add_trial_to_dt(dt_id):
    dt_to_add_to = Discreet_Trial.query.get(dt_id)

    user_input = request.get_json()

    # print(user_input)
    if not dt_to_add_to:
        return jsonify({"message": f"Discreet Trial {dt_id} not found"})

    new_trial = Trial(**user_input, dt_id=dt_id, therapist_id=current_user.id)

    db.session.add(new_trial)
    db.session.commit()

    success_complete = new_trial.to_dict()

    return jsonify(success_complete)
