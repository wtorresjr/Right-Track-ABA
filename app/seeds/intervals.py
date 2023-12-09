from app.models import db, Interval, environment, SCHEMA
from app.models.db import fake
from sqlalchemy.sql import text
from datetime import time, timedelta
from random import randint, choice
import json

behaviors = [
    "Tantrums",
    "Throwing",
    "Self-Injurious Behiavior",
    "Biting",
    "Aggression",
    "Crying",
    "Vocal Stereotypy",
    "Property Destruction",
    "Kicking",
    "Spitting",
    "Non-Compliance",
    "Elopement",
    "Task Refusal",
    "Outbursts",
    "Mouthing",
    "Negative Statements",
    "Inappropriate Language",
    "Hitting",
    "PICA",
    "Food Refusal",
]


# Adds a demo user, you can add other users here if you want
from datetime import time, timedelta


from datetime import datetime, time, timedelta


def seed_intervals():
    for chart_id in range(1, 126):
        start_time = datetime(2023, 1, 1, 9, 15)
        for _ in range(randint(3, 9)):
            interval_tags = [choice(behaviors) for _ in range(randint(0, 6))]
            interval_rating = 1 if len(interval_tags) > 0 else choice([2, 3])

            interval1 = Interval(
                start_interval=start_time.time(),
                end_interval=(start_time + timedelta(minutes=15)).time(),
                interval_notes=fake.text(),
                interval_tags=json.dumps(interval_tags),
                interval_rating=interval_rating,
                chart_id=chart_id,
            )
            db.session.add(interval1)

            start_time += timedelta(minutes=randint(15, 30))
            if start_time.minute == 45:
                start_time += timedelta(minutes=15)
            elif start_time.minute == 60:
                start_time = start_time.replace(hour=start_time.hour + 1, minute=0)
    db.session.commit()


def undo_intervals():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.intervals RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM intervals"))

    db.session.commit()
