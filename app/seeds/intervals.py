import os
import sys
import json
import sys
import time

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.seeds.ml_learning_seed import Interval_Data
from app.models.db import db
from app.models import Interval
from datetime import date, timedelta, datetime
from random import randint


# def seed_intervals():
def seed_intervals():
    # with current_app.app_context():
    for interval in Interval_Data:

        start_strip = time.strptime(interval["start_interval"], "%H:%M:%S")
        end_strip = time.strptime(interval["end_interval"], "%H:%M:%S")

        start_int = start_strip.tm_hour, start_strip.tm_min
        end_int = end_strip.tm_hour, end_strip.tm_min

        start_time = datetime(2023, 1, 1, start_int[0], start_int[1])
        end_time = datetime(2023, 1, 1, end_int[0], end_int[1])

        new_int = Interval(
            start_interval=start_time.time(),
            end_interval=end_time.time(),
            activity=interval["activity"],
            interval_tags=interval["interval_tags"],
            interval_rating=interval["interval_rating"],
            interval_notes=interval["interval_notes"],
            therapist_id=1,
            chart_id=interval["chart_id"],
        )

        db.session.add(new_int)
    db.session.commit()


# seed_intervals()
