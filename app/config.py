# import os
  
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

