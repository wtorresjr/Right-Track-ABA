from app.models import db, Daily_Chart, environment, SCHEMA
from app.models.db import fake
from sqlalchemy.sql import text
from datetime import date
from random import randint


# Adds a demo user, you can add other users here if you want
def seed_daily_charts():
    for client in range(1, 26):
        for _ in range(5):
            chart = Daily_Chart(
                client_id=client,
                chart_date=fake.date_between(
                    start_date=date(2023, 12, 1), end_date=date(2024, 1, 30)
                ),
            )
            db.session.add(chart)
    db.session.commit()


def undo_daily_charts():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.daily_charts RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM daily_charts"))

    db.session.commit()
