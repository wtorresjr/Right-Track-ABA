from app.models import db, Discreet_Trial, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import date



# Adds a demo user, you can add other users here if you want
def seed_discreet_trials():
    dt_1 = Discreet_Trial(trial_date=date(2023,12,8),client_id=1,program_name="Identifying Colors", program_notes="Color identification in field of 3")

    db.session.add(dt_1)
    db.session.commit()


def undo_discreet_trials():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.discreet_trials RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM discreet_trials"))

    db.session.commit()
