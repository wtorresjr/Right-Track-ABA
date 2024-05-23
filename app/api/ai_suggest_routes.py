from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, login_required
from app.models import db
from app.models import Client,Daily_Chart, Interval
from sqlalchemy.orm import joinedload
from datetime import date

ai_suggest = Blueprint("ai-suggest", __name__)

@ai_suggest.route("/<int:client_id>", methods=["GET"])
@login_required
def get_clean_records(client_id):
    client_records = Client.query.filter_by(id=client_id).all()
    
    if not client_records:
        return jsonify({"message":f"No records found."})
    
    found_records = [record.to_dict() for record in client_records]
    
    return jsonify(found_records)