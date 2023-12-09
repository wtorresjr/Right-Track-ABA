from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin
from datetime import datetime


class Client(db.Model, UserMixin):
    __tablename__ = "clients"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(35), nullable=False)
    guardian_email = db.Column(db.String(255), nullable=False)
    therapist_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("therapists.id")), nullable=False
    )
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    therapist = db.relationship("Therapist", back_populates="clients")
    daily_charts = db.relationship("Daily_Chart", back_populates="client")
    discreet_trials = db.relationship("Discreet_Trial", back_populates="client")
    trials = db.relationship("Trial", back_populates="client")

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "guardian_email": self.guardian_email,
            "therapist_id": self.therapist_id,
        }
