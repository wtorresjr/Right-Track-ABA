from app.models import db, Client, Daily_Chart, Interval, environment, SCHEMA

# from app.models.db import fake
from faker import Faker
from sqlalchemy.sql import text
from datetime import date, timedelta, datetime
from random import randint, choice
from .seeder_helper_arrays import (
    behaviors,
    program_names,
    field_count,
    color_choices,
    shape_choices,
    activities,
)
from .intervals import seed_intervals
from .discreet_trials import seed_discreet_trials, undo_discreet_trials
import json

fake = Faker()


def seed_clients():
    for client_idx in range(1, 4):
        client = Client(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            guardian_email=fake.email(),
            dob=fake.date_between(
                start_date=date(2016, 1, 1), end_date=date(2020, 6, 30)
            ),
            client_notes=fake.paragraph(nb_sentences=5),
            # therapist_id=randint(1, 3),
            therapist_id=1,
        )
        db.session.add(client)
        db.session.commit()

        new_client = client.to_dict()

        seed_discreet_trials(new_client)

        for _ in range(1, 4):
            chart = Daily_Chart(
                client_id=client_idx,
                chart_date=fake.date_between(
                    start_date=date(2023, 12, 1), end_date=date(2024, 1, 30)
                ),
                therapist_id=new_client["therapist_id"],
                chart_complete=True,
            )
            db.session.add(chart)
            db.session.commit()
            new_chart = chart.to_dict()

            seed_intervals(new_chart["id"], new_chart["therapist_id"])

    db.session.commit()


def undo_clients():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.clients RESTART IDENTITY CASCADE;")
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.daily_charts RESTART IDENTITY CASCADE;"
        )
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.intervals RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM clients"))
        db.session.execute(text("DELETE FROM daily_charts"))
        db.session.execute(text("DELETE FROM intervals"))
        undo_discreet_trials()

    db.session.commit()
