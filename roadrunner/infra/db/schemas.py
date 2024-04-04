from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class UserBase(BaseModel):
    username: str
    email: str

class CaptureSessionBase(BaseModel):
    user_id: int
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class AudioSnippetBase(BaseModel):
    capture_session_id: int
    file_name: str
    recorded_at: Optional[datetime] = None
    transcription: dict
    embeddings: dict

class ConversationBase(BaseModel):
    user_id: int
    timestamp: Optional[datetime] = None
    user_message: str
    assistant_response: str

class UserCreate(UserBase):
    password: str

class CaptureSessionCreate(CaptureSessionBase):
    pass

class AudioSnippetCreate(AudioSnippetBase):
    pass

class ConversationCreate(ConversationBase):
    pass

class User(UserBase):
    id: int
    capture_sessions: List['CaptureSession'] = []
    conversations: List['Conversation'] = []
    class Config:
        orm_mode = True

class CaptureSession(CaptureSessionBase):
    id: int
    audio_snippets: List['AudioSnippet'] = []
    class Config:
        orm_mode = True

class AudioSnippet(AudioSnippetBase):
    id: int
    class Config:
        orm_mode = True

class Conversation(ConversationBase):
    id: int
    class Config:
        orm_mode = True

User.update_forward_refs()
CaptureSession.update_forward_refs()
AudioSnippet.update_forward_refs()
