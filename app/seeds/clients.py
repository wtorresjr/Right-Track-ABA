from app.models import db, Client, Daily_Chart, Interval, environment, SCHEMA
from app.models.db import fake
from sqlalchemy.sql import text
from datetime import date, timedelta, datetime
from random import randint, choice
from .seeder_helper_arrays import (
    behaviors,
    program_names,
    field_count,
    color_choices,
    shape_choices,
)
from .discreet_trials import seed_discreet_trials, undo_discreet_trials
import json


def seed_clients():
    for client_idx in range(1, 31):
        client = Client(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            guardian_email=fake.email(),
            dob=fake.date_between(
                start_date=date(2016, 1, 1), end_date=date(2019, 6, 30)
            ),
            therapist_id=randint(1, 3),
        )

        db.session.add(client)
        db.session.commit()

        new_client = client.to_dict()

        seed_discreet_trials(new_client)

        # def seed_daily_charts():
        for _ in range(randint(5, 9)):
            chart = Daily_Chart(
                client_id=client_idx,
                chart_date=fake.date_between(
                    start_date=date(2023, 12, 1), end_date=date(2024, 1, 30)
                ),
                therapist_id=new_client["therapist_id"],
            )
            db.session.add(chart)
            db.session.commit()
            new_chart = chart.to_dict()

            # def seed_intervals():
            start_time = datetime(2023, 1, 1, 9, 15)
            for _ in range(randint(3, 9)):
                interval_tags = [choice(behaviors) for _ in range(randint(0, 6))]
                interval_rating = 1 if len(interval_tags) > 0 else choice([2, 3])

                int_tags = {}
                for behavior in interval_tags:
                    int_tags[behavior] = randint(1, 9)

                interval1 = Interval(
                    start_interval=start_time.time(),
                    end_interval=(start_time + timedelta(minutes=15)).time(),
                    interval_notes=fake.text(),
                    interval_tags=int_tags,
                    interval_rating=interval_rating,
                    therapist_id=new_client["therapist_id"],
                    chart_id=new_chart["id"],
                )
                db.session.add(interval1)
                db.session.commit()

                start_time += timedelta(minutes=randint(15, 30))
                if start_time.minute == 45:
                    start_time += timedelta(minutes=15)
                elif start_time.minute == 60:
                    start_time = start_time.replace(hour=start_time.hour + 1, minute=0)

    db.session.commit()

    # seed_daily_charts()


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
