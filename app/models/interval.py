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
    interval_notes = db.Column(db.String(300))
    interval_tags = db.Column(db.String())
    interval_rating = db.Column(db.Integer, nullable=False)
    chart_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("daily_charts.id")),
        nullable=False,
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    chart = db.relationship("Daily_Chart", back_populates="intervals")

    def to_dict(self):
        return {
            "id": self.id,
            "start_interval": self.start_interval,
            "end_interval": self.end_interval,
            "interval_notes": self.interval_notes,
            "interval_rating": self.interval_rating,
            "chart_id": self.chart_id,
        }