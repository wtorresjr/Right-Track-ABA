from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin
from datetime import datetime


class Daily_Chart(db.Model, UserMixin):
    __tablename__ = "daily_charts"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("clients.id")), nullable=False
    )
    
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    client = db.relationship("Client", back_populates="daily_charts")
    intervals = db.relationship("Interval", back_populates="chart")

    def to_dict(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
        }
