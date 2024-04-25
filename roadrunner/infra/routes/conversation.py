from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import crud, schemas
from ..db.db import get_db

router = APIRouter()


@router.post("/conversations/", response_model=schemas.Conversation)
def log_conversation_endpoint(
    conversation_data: schemas.ConversationCreate, db: Session = Depends(get_db)
):
    return crud.create_conversation(db=db, conversation_data=conversation_data)


@router.get("/conversations", response_model=List[schemas.Conversation])
def get_all_conversations(db: Session = Depends(get_db)):
    return db.query(crud.Conversation).all()


@router.get("/conversations/{conversation_id}", response_model=schemas.Conversation)
def get_conversation_by_id(conversation_id: int, db: Session = Depends(get_db)):
    conversation = crud.get_conversation(db, conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation
