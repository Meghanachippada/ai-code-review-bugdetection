# server-python/database.py
"""
Database configuration file for AI Code Review Platform.
Handles PostgreSQL connection using SQLAlchemy and provides
a SessionLocal and Base class for ORM models.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
import sys

# -------------------------------------------
# Load environment variables from .env file
# -------------------------------------------
load_dotenv()

# Retrieve DATABASE_URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ DATABASE_URL not found in environment variables.")
    sys.exit(1)

# -------------------------------------------
# Create SQLAlchemy Engine for PostgreSQL
# -------------------------------------------
try:
    engine = create_engine(DATABASE_URL)
    print("✅ Database engine created successfully!")
except Exception as e:
    print("❌ Error creating database engine:", e)
    sys.exit(1)

# -------------------------------------------
# SessionLocal and Base model setup
# -------------------------------------------
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# -------------------------------------------
# Dependency for FastAPI routes
# -------------------------------------------
def get_db():
    """Yields a database session and ensures closure."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------------------------
# Optional: Quick connection test (for debugging)
# -------------------------------------------
if __name__ == "__main__":
    try:
        from sqlalchemy import text
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Database connected successfully! Test query result:", list(result))
    except Exception as e:
        print("❌ Database connection failed:", e)
