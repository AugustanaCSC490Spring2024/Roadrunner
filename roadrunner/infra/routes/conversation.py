from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import crud, schemas
from ..db.db import get_db

router = APIRouter()

@router.post("/conversations/", response_model=schemas.Conversation)
def log_conversation_endpoint(conversation: schemas.ConversationCreate, db: Session = Depends(get_db)):
    return crud.log_conversation(db=db, conversation_data=conversation)

@router.get("/conversations/", response_model=List[schemas.Conversation])
def get_all_conversations(db: Session = Depends(get_db)):
    return db.query(crud.Conversation).all()
