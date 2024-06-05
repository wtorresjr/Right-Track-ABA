from flask import jsonify
from collections import OrderedDict, defaultdict
from flask import Blueprint, jsonify, request, Response
from collections import OrderedDict
from transformers import pipeline
from flask_login import current_user, login_user, login_required
from app.models import db
from app.models import Client, Daily_Chart, Interval
from sqlalchemy.orm import joinedload
from datetime import date
import json

ai_suggest = Blueprint("ai-suggest", __name__)

# pipe = pipeline("text-generation",
#                 model="microsoft/Phi-3-vision-128k-instruct", trust_remote_code=True)


def dict_to_string(d):
    """Convert a dictionary to a string."""
    return ", ".join([f"{k}: {v}" for k, v in d.items()])


@ai_suggest.route("/<int:client_id>", methods=["GET"])
@login_required
def get_clean_records(client_id):
    client_records = (
        Interval.query.join(Daily_Chart)
        .filter(Daily_Chart.client_id == client_id)
        .options(joinedload(Interval.chart))
        .all()
    )

    if not client_records:
        return jsonify({"message": f"No records found."})

    found_intervals = [
        OrderedDict([
            ("date", record.chart.to_dict().get("chart_date")),
            ("start_time", record.to_dict().get("start_interval")),
            ("activity", record.to_dict().get("activity")),
            ("behaviors", dict_to_string(record.to_dict().get("interval_tags"))),
            ("interval_notes", record.to_dict().get("interval_notes")),
            ("end_time", record.to_dict().get("end_interval"))
        ])
        for record in client_records
    ]

    values_only = [list(interval.values())
                   for interval in found_intervals]

    text_only = ""

    for item in values_only:
        for text in item:
            text_only += f" {text}"

    return jsonify(text_only)


# @ai_suggest.route("/ai-feedback", methods=["POST"])
# @login_required
# def suggest_treatment():
#     data = request.json
#     input_data = data

#     print(data, "User sent data")

#     response = pipe(input_data)
#     ai_suggestion = response

#     return jsonify({"Client Suggestions": ai_suggestion})
