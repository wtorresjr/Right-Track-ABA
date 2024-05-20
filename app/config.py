# import os


# class Config:
#     SECRET_KEY = os.environ.get("SECRET_KEY")
#     FLASK_RUN_PORT = os.environ.get("FLASK_RUN_PORT")
#     SQLALCHEMY_TRACK_MODIFICATIONS = False
#     # SQLAlchemy 1.4 no longer supports url strings that start with 'postgres'
#     # (only 'postgresql') but heroku's postgres add-on automatically sets the
#     # url in the hidden config vars to start with postgres.
#     # so the connection uri must be updated here (for production)

#     SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL").replace("postgres://", "postgresql://"
#     )
#     SQLALCHEMY_ECHO = True
    
import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    ENVIRONMENT = os.environ.get("ENVIRONMENT")
    FLASK_RUN_PORT = os.environ.get("FLASK_RUN_PORT")
    
    
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///dev.db")
    if SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    SQLALCHEMY_ECHO = True

