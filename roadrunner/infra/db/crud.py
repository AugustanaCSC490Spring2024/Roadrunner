from passlib.context import CryptContext
from sqlalchemy.orm import Session

from .models import AudioSnippet, CaptureSession, Conversation, User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def fetch_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def register_user(db: Session, user):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_capture_session(db: Session, session_data):
    new_session = CaptureSession(**session_data.dict())
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

def add_audio_snippet_to_session(db: Session, session_id: int, snippet_data):
    session = db.query(CaptureSession).filter(CaptureSession.id == session_id).first()
    if session:
        new_snippet = AudioSnippet(**snippet_data.dict(), capture_session_id=session_id)
        db.add(new_snippet)
        db.commit()
        return new_snippet
    return None

def log_conversation(db: Session, conversation_data):
    new_conversation = Conversation(**conversation_data.dict())
    db.add(new_conversation)
    db.commit()
    return new_conversation

# Capture
def get_all_capture_sessions(db: Session):
    return db.query(CaptureSession).all()

def get_audio_snippets_by_session(db: Session, session_id: int):
    return db.query(AudioSnippet).filter(AudioSnippet.capture_session_id == session_id).all()