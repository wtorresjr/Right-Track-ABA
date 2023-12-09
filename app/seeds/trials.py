from app.models import db, Trial, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import date


# Adds a demo user, you can add other users here if you want
def seed_trials():
    trial1 = Trial(
        dt_id=1,
        client_id=1,
        trial_target="Red",
        trial_count=5,
        trial_score=3,
        trial_notes="Had trouble identifying initially, provided prompts.",
    )

    db.session.add(trial1)
    db.session.commit()


def undo_trials():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.trials RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM trials"))

    db.session.commit()
