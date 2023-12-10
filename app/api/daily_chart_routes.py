from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import db
from app.models import Daily_Chart


daily_charts_bp = Blueprint("my-daily-charts", __name__)



# @daily_charts_bp.route('/',methods=['GET'])
@login_required
def get_all_charts():
    pass