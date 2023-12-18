from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db
from app.models import Daily_Chart, Client, Interval


daily_charts_bp = Blueprint("my-daily-charts", __name__)


# Get all therapist charts
@daily_charts_bp.route("/", methods=["GET"])
@login_required
def get_all_charts():
    therapist_charts = Daily_Chart.query.filter_by(therapist_id=current_user.id).all()
    chart_list = [chart.to_dict() for chart in therapist_charts]
    if not chart_list:
        return jsonify({"message": "No charts found"}), 404

    return jsonify({"Therapist_Charts": chart_list})


# GET, READ, UPDATE A Chart by ID


@daily_charts_bp.route("/<int:chart_id>", methods=["GET", "DELETE", "PUT"])
@login_required
def get_chart_by_id(chart_id):
    chart_found = Daily_Chart.query.get(chart_id)

    all_chart_intervals = Interval.query.filter_by(chart_id=chart_id).all()

    intervals = [interval.to_dict() for interval in all_chart_intervals]

    if not chart_found:
        return jsonify({"message": "No chart found by that ID"}), 404

    chart_data = chart_found.to_dict()

    if chart_data["therapist_id"] == current_user.id:
        if request.method == "DELETE":
            db.session.delete(chart_found)
            db.session.commit()

            return (
                jsonify({"message": f"Successfully deleted chart ID {chart_id}"}),
                200,
            )

        if request.method == "GET":
            return jsonify({"Chart": chart_data, "Chart_Intervals": intervals}), 200

        if request.method == "PUT":
            user_edit_data = request.get_json()

            for [key, item] in user_edit_data.items():
                setattr(chart_found, key, item)

            db.session.commit()

            return jsonify({"Edited_Chart": chart_found.to_dict()})

    else:
        return (
            jsonify({"message": "Forbidden, therapist did not create this chart"}),
            403,
        )


@daily_charts_bp.route("/", methods=["POST"])
@login_required
def add_new_client():
    new_chart_data = request.get_json()

    new_chart = Daily_Chart(
        chart_date=new_chart_data["chart_date"],
        client_id=new_chart_data["client_id"],
        therapist_id=current_user.id,
    )

    db.session.add(new_chart)
    db.session.commit()

    return jsonify({"Req data": new_chart.to_dict()})


@daily_charts_bp.route("/client/<int:client_id>", methods=["GET"])
@login_required
def get_chart_by_client_id(client_id):
    found_client_charts = Daily_Chart.query.filter_by(
        client_id=client_id, therapist_id=current_user.id
    ).all()

    if not found_client_charts:
        return (
            jsonify(
                {
                    "message": f"Client {client_id} may not exist or is not registered to logged in therapist."
                }
            ),
            404,
        )

    client_charts = [
        {
            "Chart": chart.to_dict(),
            "Intervals": [interval.to_dict() for interval in chart.intervals],
        }
        for chart in found_client_charts
    ]

    return client_charts[0]
