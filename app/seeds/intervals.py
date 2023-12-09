from app.models import db, Interval, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import time


# Adds a demo user, you can add other users here if you want
def seed_intervals():
    interval1 = Interval(start_interval=time(hour=9, minute=15),
        end_interval=time(hour=9, minute=30),
        interval_notes='First interval of the day',
        interval_tags='productive',
        interval_rating=4,
        chart_id=1)

    db.session.add(interval1)
    db.session.commit()


def undo_intervals():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.intervals RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM intervals"))

    db.session.commit()
