import numpy as np
from fastapi import HTTPException
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from infra.db.schemas import (
    ConversationBase,
    ConversationCreate,
    ConversationMessage,
)
from infra.utils import logger

log = logger.get_logger(__name__)


from .models import Capture, Conversation, Embedding, User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()


def get_all_users(db: Session) -> list:
    return db.query(User).all()


def fetch_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()


def register_user(db: Session, user) -> User:
    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        username=user.username, email=user.email, hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_capture(db: Session, capture_data) -> Capture:
    new_capture = Capture(**capture_data.dict())
    db.add(new_capture)
    db.commit()
    db.refresh()
    return new_capture


# Conversation
def create_conversation(
    db: Session, conversation_data: ConversationCreate
) -> Conversation:
    log.info(f"Create conversation data: {conversation_data}")
    new_conversation = Conversation(**conversation_data.model_dump())
    db.add(new_conversation)
    db.commit()
    return new_conversation


def add_message_to_conversation(
    db: Session, conversation_id: int, messages: list[ConversationMessage]
) -> Conversation:
    conversation = get_conversation(db, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    conversation.context.append(messages)
    db.commit()
    return conversation


def get_conversation(db: Session, conversation_id: int) -> Conversation:
    return db.query(Conversation).filter(Conversation.id == conversation_id).first()


def get_all_captures(db: Session) -> list:
    return db.query(Capture).all()


# Embedding
def create_embedding(db: Session, text: str, vector: np.ndarray) -> Embedding:
    embedding = Embedding(text=text, vector=vector)
    db.add(embedding)
    db.commit()
    return embedding


def get_all_embeddings(db: Session) -> list:
    return db.query(Embedding).all()


def get_embedding(db: Session, text: str) -> Embedding:
    return db.query(Embedding).filter(Embedding.text == text).first()
