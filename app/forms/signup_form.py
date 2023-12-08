from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import Therapist


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    therapist = Therapist.query.filter(Therapist.email == email).first()
    if therapist:
        raise ValidationError('Email address is already in use.')


class SignUpForm(FlaskForm):
    email = StringField('email', validators=[DataRequired(), user_exists])
    first_name = StringField(
        'first_name', validators=[DataRequired()])
    last_name = StringField(
        'last_name', validators=[DataRequired()])
    password = StringField('password', validators=[DataRequired()])
