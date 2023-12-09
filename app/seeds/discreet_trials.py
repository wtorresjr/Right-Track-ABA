from app.models import db, Discreet_Trial, Trial, environment, SCHEMA
from app.models.db import fake
from sqlalchemy.sql import text
from random import randint, choice
from datetime import date


program_names = ["Indentifying Colors", "Identifying Numbers", "Identifying Shapes"]
field_count = [3, 4, 5]


# Adds a demo user, you can add other users here if you want
def seed_trials():
    trial1 = Trial(
        dt_id=1,
        client_id=1,
        trial_target="Red",
        trial_count=5,
        trial_score=3,
        trial_notes=fake.paragraph(nb_sentences=3, ext_word_list=["Test"]),
    )
    db.session.add(trial1)


def seed_discreet_trials():
    for dt in range(400):
        prog_name = choice(program_names)
        prog_note_txt = prog_name.split(" ")
        count_of_field = choice(field_count)

        dt_1 = Discreet_Trial(
            trial_date=fake.date_between(
                start_date=date(2023, 12, 1), end_date=date(2024, 2, 6)
            ),
            client_id=randint(1, 26),
            program_name=prog_name,
            program_notes=f"Indentifying {prog_note_txt[1]} in a field of {count_of_field}",
        )

        db.session.add(dt_1)

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
