import requests
from flask import Flask, jsonify, request, Blueprint
from flask import Flask, jsonify, request
from flask import jsonify, Flask
from collections import OrderedDict, defaultdict
from flask import Blueprint, jsonify, request, Response
from collections import OrderedDict
from flask_login import current_user, login_user, login_required
from app.models import Client, Daily_Chart, Interval
from sqlalchemy.orm import joinedload
from .ai_prompts import trend_prompt


app = Flask(__name__)

ai_suggest_post = Blueprint("ai-suggest-post", __name__)


def dict_to_string(d):
    """Convert a dictionary to a string."""
    return ", ".join([f"{k}: {v}" for k, v in d.items()])


@ai_suggest_post.route("/", methods=["POST"])
def suggest_treatment():

    data = request.get_json()
    ollama_url = "http://localhost:11434/api/generate"

    prompt = data.get("prompt", "")
    payload = {
        "prompt": f'{prompt}',
        "model": data.get("model", "phi3"),
        "stream": data.get("stream")
    }

    # print(f"Sending payload to Ollama API: {payload}")

    response = requests.post(ollama_url, json=payload)

    # print(
    #     f"Received response from Ollama API: {response.status_code} - {response.text}")

    if response.status_code == 200:
        try:
            response_data = response.json()
            if response_data:
                response_message = response_data
            else:
                response_message = {
                    "error": "Unexpected response structure", "response_data": response_data}

            return jsonify(response_message)

        except ValueError:
            return jsonify({"error": "Failed to decode JSON response from Ollama API", "response_text": response.text})
    else:
        return jsonify({"error": f"Request failed with status code {response.status_code}"}), response.status_code


if __name__ == "__main__":
    app.register_blueprint(ai_suggest_post, url_prefix="/api/ai-suggest-post")
    app.run(debug=True)


@ai_suggest_post.route("/<int:client_id>", methods=["GET"])
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

    for values in values_only:
        text_only += f"|| "
        for text in values:
            text_only += f"{text}:: "

    return jsonify({"cleanData": text_only})
