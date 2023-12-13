from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin
from datetime import date, datetime


class Trial(db.Model, UserMixin):
    __tablename__ = "trials"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)

    dt_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("discreet_trials.id")),
        nullable=False,
    )

    client_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("clients.id")), nullable=False
    )
    therapist_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("therapists.id"))
    )

    trial_target = db.Column(db.String(100), nullable=False)
    trial_count = db.Column(db.Integer, nullable=False)
    trial_score = db.Column(db.Integer, nullable=False)
    trial_notes = db.Column(db.String(300), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    client = db.relationship("Client", back_populates="trials")
    discreet_trials = db.relationship("Discreet_Trial", back_populates="trials")
    therapist = db.relationship("Therapist", back_populates="trials")

    def to_dict(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "dt_id": self.dt_id,
            "trial_target": self.trial_target,
            "trial_count": self.trial_count,
            "trial_score": self.trial_score,
            "trial_notes": self.trial_notes,
        }
