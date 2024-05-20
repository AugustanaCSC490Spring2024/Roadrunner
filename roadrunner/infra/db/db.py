import json
import logging
from datetime import datetime

import sqlalchemy
from databases import Database
from regex import P
from sqlalchemy import JSON, create_engine
from sqlalchemy.orm import Session, sessionmaker

from .models import Capture, Conversation, Message

DATABASE_URL = "sqlite:///./database.db"
database = Database(DATABASE_URL)
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    pool_size=20,
    max_overflow=0,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

metadata = sqlalchemy.MetaData()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def connect_db():
    await database.connect()
    logger.info("Database connected.")


async def disconnect_db():
    await database.disconnect()
    logger.info("Database disconnected.")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        logger.info("Database session closed.")


async def store_capture_database(
    db: Session, user_id: int, transcript: str, embeddings: list, metadata: dict
):
    try:
        embeddings_json = {"data": embeddings}

        capture = Capture(
            user_id=user_id,
            transcript=transcript,
            embeddings=embeddings_json,
            created_at=metadata["recorded_at"],
        )
        db.add(capture)
        db.commit()

        logger.info("Capture stored in database successfully.")
    except Exception as e:
        db.rollback()  # Rollback the session in case of error
        logger.error(f"Error storing data in database: {e}")
        raise e
