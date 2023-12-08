from app.models import db, Client, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_clients():
    client1 = Client(first_name='Johnny', last_name='Doe',
                     guardian_email='johnnydoe@gmail.com', therapist_id=1)

    db.session.add(client1)
    db.session.commit()


def undo_clients():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.clients RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM clients"))

    db.session.commit()
