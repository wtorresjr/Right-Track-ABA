from app.models import db, Client, Daily_Chart, environment, SCHEMA
from app.models.db import fake
from sqlalchemy.sql import text
from datetime import date
from random import randint


def seed_clients():
    for client_idx in range(1, 31):
        client = Client(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            guardian_email=fake.email(),
            therapist_id=randint(1, 3),
        )
        db.session.add(client)
        db.session.commit()

        new_client = client.to_dict()

        def seed_daily_charts():
            for _ in range(randint(5, 9)):
                chart = Daily_Chart(
                    client_id=client_idx,
                    chart_date=fake.date_between(
                        start_date=date(2023, 12, 1), end_date=date(2024, 1, 30)
                    ),
                    therapist_id=new_client["therapist_id"],
                )
                db.session.add(chart)

        seed_daily_charts()


def undo_clients():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.clients RESTART IDENTITY CASCADE;")
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.daily_charts RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM clients"))
        db.session.execute(text("DELETE FROM daily_charts"))

    db.session.commit()
