import requests
from flask import Flask, jsonify, request, Blueprint
from flask import Flask, jsonify, request
from flask import jsonify, Flask
from collections import OrderedDict, defaultdict
from flask import Blueprint, jsonify, request, Response
from collections import OrderedDict
from transformers import pipeline, AutoTokenizer
from flask_login import current_user, login_user, login_required
from app.models import db
from app.models import Client, Daily_Chart, Interval
from sqlalchemy.orm import joinedload
from datetime import date
import subprocess
# from api.ai_prompts import analysis_data_prompt

# analysis_data_prompt = "You are an ABA Professional tasked with reviewing session interval data, identifying trends and recommending intervention strategies. The intervals are separated by || and different data points within the intervals are separated by :: if there are back to back :: :: like this that means there were no problem behaviors logged for the interval. Please provide an overall analysis of the provided data and suggest intervention strategies. Please identify any trends related to time of day, activity and behaviors exhibited."

analysis_data_prompt = "Count the numbers in the array"

# from ai_prompts import prompt1
app = Flask(__name__)

# ai_suggest = Blueprint("ai-suggest", __name__)

ai_suggest_post = Blueprint("ai-suggest-post", __name__)


def dict_to_string(d):
    """Convert a dictionary to a string."""
    return ", ".join([f"{k}: {v}" for k, v in d.items()])


@ai_suggest_post.route("/", methods=["POST"])
def suggest_treatment():
    # Define the URL of the Ollama server's API endpoint
    # Get JSON data from the request
    data = request.get_json()
    ollama_url = "http://localhost:11434/api/generate"
    # Define the JSON payload containing the input data

    prompt = data.get("prompt", "")
    payload = {
        "prompt": f'{analysis_data_prompt} = {prompt}',
        # "prompt":f'{analysis_data_prompt} = # #',
        "model": data.get("model", "phi3"),
        "stream": data.get("stream")
    }

    print(f"Sending payload to Ollama API: {payload}")

    # Send a POST request to the Ollama server's API endpoint with the JSON payload
    response = requests.post(ollama_url, json=payload)

    print(
        f"Received response from Ollama API: {response.status_code} - {response.text}")

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Parse the response JSON data
        try:
            response_data = response.json()

            # Check if the response contains the expected structure
            if response_data:
                # Extract the response message from the data
                response_message = response_data
            else:
                # Handle the case where the expected structure is not present
                response_message = {
                    "error": "Unexpected response structure", "response_data": response_data}

            # Return the response message as JSON
            return jsonify(response_message)

        except ValueError:
            # Handle JSON decoding error
            return jsonify({"error": "Failed to decode JSON response from Ollama API", "response_text": response.text})
    else:
        # Return an error message if the request failed
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
        text_only += f" || "
        for text in values:
            text_only += f"{text}:: "

    return jsonify(text_only)
