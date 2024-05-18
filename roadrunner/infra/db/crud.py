import json
from datetime import datetime

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


from .models import Capture, Conversation, Embedding, User, Message

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()


def get_all_users(db: Session) -> list:
    return db.query(User).all()


def fetch_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()


def fetch_user_by_username(db: Session, username: str) -> User:
    print("Came here for session")
    return db.query(User).filter(User.username == username).first()


def register_user(db: Session, user) -> User:
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


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
    log.info(f"Creating new conversation with data: {conversation_data}")
    new_conversation = Conversation(
        user_id=conversation_data.user_id,
        context=conversation_data.context,
        created_at=datetime.utcnow(),
    )
    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)
    return new_conversation


def add_message_to_conversation(
    db: Session, user_id: int, conversation_id: int, messages: list[ConversationMessage]
) -> Conversation:
    try:
        conversation = get_conversation(db, user_id, conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        if isinstance(conversation.context, str):
            conversation.context = json.loads(conversation.context)
        if not isinstance(conversation.context, list):
            conversation.context = []
        conversation.context.extend([msg.dict() for msg in messages])

        conversation.context = json.dumps(conversation.context)
        db.commit()
        db.refresh(conversation)
        return conversation
    except Exception as e:
        db.rollback()
        log.error(f"Failed to add messages to conversation: {e}")
        raise HTTPException(status_code=500, detail="Failed to update conversation")

def get_conversation(db: Session, user_id:int, conversation_id: int) -> Conversation:
    return db.query(Conversation).filter(Conversation.user_id == user_id, Conversation.id == conversation_id).first()

def get_all_conversations(db: Session) -> list[Conversation]:
    return db.query(Conversation).all()

def get_all_conversations_by_user(db: Session, user_id: int) -> list:
    return db.query(Conversation).filter(Conversation.user_id == user_id).all()

def get_all_messages_by_user(db: Session, user_id: int) -> list:
    return db.query(Message).filter(Message.user_id == user_id).all()

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
