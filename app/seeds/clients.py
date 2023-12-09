from app.models import db, Client, environment, SCHEMA
from app.models.db import fake
from sqlalchemy.sql import text



def seed_clients():
    for _ in range(25):
        client = Client(first_name=fake.first_name(), last_name=fake.last_name(), guardian_email=fake.email(), therapist_id=1)
        db.session.add(client)

    db.session.commit()

def undo_clients():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.clients RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM clients"))

    db.session.commit()
