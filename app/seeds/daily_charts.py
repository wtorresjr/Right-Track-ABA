from app.models import db, Daily_Chart, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_daily_charts():

    chart1 = Daily_Chart(client_id=1)

    db.session.add(chart1)

    db.session.commit()


def undo_daily_charts():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.daily_charts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM daily_charts"))

    db.session.commit()
