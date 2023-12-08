from app.models import db, Therapist, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_therapists():
    demo = Therapist(first_name='Demo', last_name='User',
                     email='demo@aa.io', password='password')

    db.session.add(demo)
    db.session.commit()

def undo_therapists():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.therapists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM therapists"))

    db.session.commit()
