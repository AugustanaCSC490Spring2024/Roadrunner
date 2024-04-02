import json
import logging

import sqlalchemy
from databases import Database
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker

from .models import AudioSnippet, CaptureSession, Conversation

DATABASE_URL = "sqlite:///./database.db"
database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})  # For SQLite
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
    db: Session, user_id: int, transcription: dict, embeddings: list, metadata: dict
):
    try:
        embeddings_json = json.dumps(embeddings)
        capture_session = CaptureSession(user_id=user_id)
        db.add(capture_session)
        db.commit()
        db.refresh(capture_session)

        audio_snippet = AudioSnippet(capture_session_id=capture_session.id, transcription=transcription, embeddings=embeddings_json, file_name=metadata['file_name'], recorded_at=metadata['recorded_at'])
        db.add(audio_snippet)
        db.commit()

        logger.info("Data stored in database successfully.")
    except Exception as e:
        db.rollback()  # Rollback the session in case of error
        logger.error(f"Error storing data in database: {e}")
        raise e


async def store_conversation(
    db: Session, user_id: int, user_message: str, assistant_response: str
):
    try:
        conversation = Conversation(
            user_id=user_id,
            user_message=user_message,
            assistant_response=assistant_response,
        )
        db.add(conversation)
        logger.info("Conversation stored in database successfully.")
    except Exception as e:
        logger.error(f"Error storing conversation in database: {e}")
        raise e


