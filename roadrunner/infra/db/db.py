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


async def fetch_embeddings(text: str, db: Session):
    pass


async def store_catpure_database(
    db: Session, user_id: int, text: str, embeddings: list, metadata: dict
):
    try:
        capture_session = CaptureSession(user_id=user_id, audio_snippets=[AudioSnippet(**metadata)])
        print(capture_session)
        
        audio_snippet = AudioSnippet(text=text, embeddings=embeddings)
        
        capture_session.audio_snippets.append(audio_snippet)
        
        db.add(capture_session)
        logger.info("Data stored in database successfully.")
    except Exception as e:
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


