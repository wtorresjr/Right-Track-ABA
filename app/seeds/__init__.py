from flask.cli import AppGroup
from .therapists import seed_therapists, undo_therapists
from .clients import seed_clients, undo_clients

# from .daily_charts import seed_daily_charts, undo_daily_charts
# from .discreet_trials import seed_discreet_trials, undo_discreet_trials

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup("seed")


# Creates the `flask seed all` command
@seed_commands.command("all")
def seed():
    # if environment == "production":
        # undo_therapists()
        # undo_clients()
    seed_therapists()
    seed_clients()
    # Add other seed functions here


# @seed_commands.command("therapists")
# def seed_therapists_command():
#     seed_therapists()


# @seed_commands.command("clients")
# def seed_clients_command():
#     seed_clients()


# Creates the `flask seed undo` command
@seed_commands.command("undo")
def undo():
    undo_therapists()
    undo_clients()
    # Add other undo functions here
