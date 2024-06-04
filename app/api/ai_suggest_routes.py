from flask import Blueprint, jsonify, request
from transformers import pipeline
from flask_login import current_user, login_user, login_required
from app.models import db
from app.models import Client, Daily_Chart, Interval
from sqlalchemy.orm import joinedload
from datetime import date

ai_suggest = Blueprint("ai-suggest", __name__)

nlp = pipeline("question-answering", model="deepset/minilm-uncased-squad2",
               trust_remote_code=True)


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

    # found_intervals = [record.to_dict().get("interval_tags") for record in client_records]

    found_intervals = [record.to_dict() for record in client_records]

    return jsonify(found_intervals)


@ai_suggest.route("/ai-feedback", methods=["POST"])
@login_required
def suggest_treatment():
    data = request.json
    input_data = data

    print(data, "User sent data")

    response = nlp(input_data)
    ai_suggestion = response

    return jsonify({"Client Suggestions": ai_suggestion})
