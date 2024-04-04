from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from .schemas import AudioSnippetBase, CaptureSessionBase, ConversationBase

Base = declarative_base()


class CaptureSession(Base):
    __tablename__ = "capture_sessions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User", back_populates="capture_sessions")
    audio_snippets = relationship("AudioSnippet", back_populates="capture_session", cascade="all, delete-orphan")


class AudioSnippet(Base):
    __tablename__ = "audio_snippets"

    id = Column(Integer, primary_key=True)
    capture_session_id = Column(Integer, ForeignKey("capture_sessions.id"), nullable=False)
    file_name = Column(String, nullable=False)
    recorded_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    transcription = Column(JSON, nullable=False)
    embeddings = Column(JSON, nullable=True)

    capture_session = relationship("CaptureSession", back_populates="audio_snippets")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_message = Column(String)
    assistant_response = Column(String)

    user = relationship("User", back_populates="conversations")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    capture_sessions = relationship("CaptureSession", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")
