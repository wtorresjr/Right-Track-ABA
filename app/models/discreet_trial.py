from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin
from datetime import datetime


class Discreet_Trial(db.Model, UserMixin):
    __tablename__='discreet_trials'
    
    if environment == 'production':
        __table_args__={'schema': SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('clients.id')), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    client = db.relationship('Client', back_populates='discreet_trials')
    trial = db.relationship('Trial', back_populates='discreet_trials')
    