from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Therapist

user_routes = Blueprint('therapists', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    therapists = Therapist.query.all()
    return {'therapists': [therapist.to_dict() for therapist in therapists]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a therapist by id and returns that user in a dictionary
    """
    therapist = Therapist.query.get(id)
    return therapist.to_dict()
