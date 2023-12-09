from flask_sqlalchemy import SQLAlchemy
from faker import Faker


import os

environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


fake = Faker()
db = SQLAlchemy()


# helper function for adding prefix to foreign key column references in production
def add_prefix_for_prod(attr):
    if environment == "production":
        return f"{SCHEMA}.{attr}"
    else:
        return attr
