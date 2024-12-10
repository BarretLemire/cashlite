from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#Create a base class for declarative models
Base = declarative_base()

# Dependency: Function to get a database session
def get_db():
    db: Session = SessionLocal()  # Create a new database session
    try:
        yield db  # Provide the session to the route handler
    finally:
        db.close()  # Ensure that the session is always closed after use