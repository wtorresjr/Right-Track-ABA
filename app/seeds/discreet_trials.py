from app.models import db, Discreet_Trial, Trial, environment, SCHEMA
from app.models.db import fake
from sqlalchemy.sql import text
from random import randint, choice
from datetime import date
from .seeder_helper_arrays import (
    behaviors,
    program_names,
    field_count,
    color_choices,
    shape_choices,
)

# Adds a demo user, you can add other users here if you want


def seed_discreet_trials(client_data):
    for dt in range(randint(4,10)):
        prog_name = choice(program_names)
        prog_note_txt = prog_name.split(" ")
        count_of_field = choice(field_count)

        dt_1 = Discreet_Trial(
            trial_date=fake.date_between(
                start_date=date(2023, 12, 1), end_date=date(2024, 2, 6)
            ),
            client_id=client_data['id'],
            therapist_id=client_data['therapist_id'],
            program_name=prog_name,
            program_notes=f"Indentifying {prog_note_txt[1]} in a field of {count_of_field}",
        )

        db.session.add(dt_1)

        def seed_trials():
            trial_target = ""
            if prog_note_txt[1] == "Colors":
                trial_target = choice(color_choices)
            if prog_note_txt[1] == "Shapes":
                trial_target = choice(shape_choices)
            if prog_note_txt[1] == "Numbers":
                trial_target = randint(1, 10)
            if prog_note_txt[1] == "Sizes":
                trial_target = choice(["Smaller", "Same", "Bigger"])

            trial1 = Trial(
                dt_id=1,
                client_id=dt_1.client_id,
                trial_target=trial_target,
                trial_count=3,
                trial_score=randint(1, 3),
                trial_notes=fake.paragraph(nb_sentences=3),
            )
            db.session.add(trial1)

        seed_trials()

    db.session.commit()


def undo_discreet_trials():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.discreet_trials RESTART IDENTITY CASCADE;"
        )
        db.session.execute(f"TRUNCATE table {SCHEMA}.trials RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM discreet_trials"))
        db.session.execute(text("DELETE FROM trials"))

    db.session.commit()
