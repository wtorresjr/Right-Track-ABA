from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin
from datetime import datetime


class Interval(db.Model, UserMixin):
    __tablename__ = "intervals"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    start_interval = db.Column(db.Time, nullable=False)
    end_interval = db.Column(db.Time, nullable=False)
    interval_notes = db.Column(db.Text)
    interval_tags = db.Column(db.JSON())
    interval_rating = db.Column(db.Integer, nullable=False)
    activity = db.Column(db.String, nullable=False)
    chart_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("daily_charts.id")),
        nullable=False,
    )

    therapist_id = db.Column(db.Integer, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    chart = db.relationship("Daily_Chart", back_populates="intervals")
    client = db.relationship(
        "Client", secondary="daily_charts", back_populates="intervals"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "activity": self.activity,
            "start_interval": self.start_interval.strftime("%H:%M"),
            "end_interval": self.end_interval.strftime("%H:%M"),
            "interval_tags": self.interval_tags,
            "interval_notes": self.interval_notes,
            "interval_rating": self.interval_rating,
            "therapist_id": self.therapist_id,
            "chart_id": self.chart_id,
            "client_id": self.chart.client_id,  # Access client_id through chart relationship
        }
