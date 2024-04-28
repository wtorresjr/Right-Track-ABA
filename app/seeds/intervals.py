from app.models import db, Client, Daily_Chart, Interval, environment, SCHEMA
from datetime import date, timedelta, datetime
from ml_learning_seed import Interval
import json



def seed_intervals():
    
    for interval in Interval:
        db.session.add(**interval)
        db.session.commit()

seed_intervals()