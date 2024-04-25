from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    captures: List["Capture"] = []
    conversations: List["Conversation"] = []


class CaptureBase(BaseModel):
    user_id: int
    transcript: str
    summary: Optional[str] = None
    created_at: Optional[datetime] = None
    embeddings: Optional[dict] = None


class Capture(CaptureBase):
    id: int


class ConversationBase(BaseModel):
    user_id: int
    created_at: Optional[datetime] = None
    context: List["ConversationMessage"] = []


class Conversation(ConversationBase):
    id: int


class ConversationMessage(BaseModel):
    role: str
    content: str


class ConversationCreate(ConversationBase):
    id: Optional[int] = None


class Conversation(ConversationBase):
    id: int


class ConversationCreate(ConversationBase):
    pass


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    user_id: int


User.model_rebuild()
Capture.model_rebuild()
Conversation.model_rebuild()
