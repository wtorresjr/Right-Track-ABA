import os
import sys
import json
import sys

# Add the project root directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

# Now you can import modules from the app package
from app.models.db import db
from app.models import Interval

from datetime import date, timedelta, datetime
from app.seeds.ml_learning_seed import Interval_Data





def seed_intervals():
# def seed_intervals(imported_chart_id, client_id):
    
    for interval in Interval_Data:
        start_interval = interval["start_interval"]
        end_interval = interval["end_interval"]
        client_id = interval["client_id"]
        # chart_id = interval["chart_id"]
        activity = interval["activity"]
        interval_tags = interval["interval_tags"]
        interval_notes = interval["interval_notes"]
        
        
        print(interval_notes)

        
        # print(new_int)
        

seed_intervals()