from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin
from datetime import date, datetime


class Discreet_Trial(db.Model, UserMixin):
    __tablename__ = "discreet_trials"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    trial_date = db.Column(db.Date, nullable=False)
    client_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("clients.id")), nullable=False
    )
    program_name = db.Column(db.String(50), nullable=False)
    program_notes = db.Column(db.String(300))
    therapist_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("therapists.id")), nullable=False
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    client = db.relationship("Client", back_populates="discreet_trials")
    trials = db.relationship(
        "Trial",
        back_populates="discreet_trials",
        lazy=True,
        cascade="all,delete-orphan",
    )
    therapist = db.relationship("Therapist", back_populates="discreet_trials")

    def to_dict(self):
        return {
            "id": self.id,
            "trial_date": self.trial_date,
            "client_id": self.client_id,
            "therapist_id": self.therapist_id,
            "program_name": self.program_name,
            "program_notes": self.program_notes,
        }
