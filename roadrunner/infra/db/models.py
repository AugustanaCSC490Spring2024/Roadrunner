import json
from datetime import datetime

from sqlalchemy import (
    JSON,
    VARCHAR,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    PickleType,
    String,
    TypeDecorator,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class JSONEncodedDict(TypeDecorator):
    """Enables JSON storage by encoding and decoding on the fly."""

    impl = VARCHAR

    def process_bind_param(self, value, dialect):
        if value is not None:
            value = json.dumps(value)
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            value = json.loads(value)
        return value


class Capture(Base):
    __tablename__ = "captures"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    transcript = Column(String, nullable=False)
    summary = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    embeddings = Column(JSON, nullable=True)

    user = relationship("User", back_populates="captures")


class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(Integer, autoincrement=False)  # Autoincrement only here
    conversation_id = Column(
        Integer, primary_key=True, autoincrement=True, nullable=True
    )
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    context = Column(JSONEncodedDict, nullable=False)

    user = relationship("User", back_populates="conversations")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)

    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    captures = relationship("Capture", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")
    embeddings = relationship("Embedding", back_populates="user")


class Embedding(Base):
    __tablename__ = "embeddings"
    id = Column(Integer, primary_key=True, autoincrement=True)
    vector = Column(PickleType, nullable=False)
    text = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="embeddings")
