from flask.cli import AppGroup
from .therapists import seed_therapists, undo_therapists
from .clients import seed_clients, undo_clients
from .intervals import seed_intervals, undo_intervals
from .daily_charts import seed_daily_charts, undo_daily_charts

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_therapists()
        undo_clients()
        undo_daily_charts()
        undo_intervals()
    seed_therapists()
    seed_clients()
    seed_daily_charts()
    seed_intervals()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_therapists()
    undo_clients()
    undo_daily_charts()
    undo_intervals()
    # Add other undo functions here
