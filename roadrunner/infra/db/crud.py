from passlib.context import CryptContext
from sqlalchemy.orm import Session

from .models import Capture, Conversation, User

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


def create_conversation(db: Session, conversation_data) -> Conversation:
    new_conversation = Conversation(**conversation_data.dict())
    db.add(new_conversation)
    db.commit()
    return new_conversation


def get_all_captures(db: Session) -> list:
    return db.query(Capture).all()
