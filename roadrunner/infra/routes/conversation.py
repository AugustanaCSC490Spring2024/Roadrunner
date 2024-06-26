import json
from datetime import datetime
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException
from infra.utils import logger
from infra.utils.oauth import get_current_active_user
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from roadrunner.infra.db.models import Conversation

from ..db import crud, schemas
from ..db.db import get_db

log = logger.get_logger(__name__)


router = APIRouter()


@router.post("/conversations/", response_model=schemas.Conversation)
def log_conversation_endpoint(
    conversation_data: schemas.ConversationCreate, db: Session = Depends(get_db)
):
    return crud.create_conversation_with_id(db=db, conversation_data=conversation_data)


@router.get("/conversations", response_model=List[schemas.Conversation])
def get_all_conversations(
    current_user: Annotated[schemas.User, Depends(get_current_active_user)],
    db: Session = Depends(get_db),
):
    return crud.get_all_conversations_by_user(db, current_user.id)


@router.get("/conversations/{conversation_id}", response_model=schemas.Conversation)
def get_conversation_by_id(
    current_user: Annotated[schemas.User, Depends(get_current_active_user)],
    conversation_id: int,
    db: Session = Depends(get_db),
):
    conversation = crud.get_conversation(db, current_user.id, conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@router.get("/get-history", response_model=List[schemas.Conversation])
def get_all_history(db: Session = Depends(get_db)):
    conversation = crud.get_all_conversations(db)
    return conversation


@router.post("/update-conversation")
async def update_conversation(
    current_user: Annotated[schemas.User, Depends(get_current_active_user)],
    update_request: schemas.UpdateConversationRequest,
    db: Session = Depends(get_db),
):
    """
    Update the conversation with new messages.
    :param conversation_id: ID of the conversation to update.
    :param messages: List of message dictionaries to add to the conversation.
    :param db: Database session dependency.
    """
    conversation_id, messages = (
        update_request.conversation_id,
        update_request.messages,
    )

    log.info(f"Conversation id: {conversation_id}")
    log.info(f"Messages: {messages}")
    try:
        conversation = crud.get_conversation(db, current_user.id, conversation_id)
        if not conversation:
            log.error(f"No conversation found with ID {conversation_id}")
            return {"error": "Conversation not found"}, 404

        crud.add_message_to_conversation(
            db=db,
            user_id=current_user.id,
            conversation_id=conversation_id,
            messages=messages,
        )
        db.commit()
        log.info(f"Updated conversation {conversation_id} with new messages.")
        return {"message": "Conversation updated successfully"}, 200
    except Exception as e:
        db.rollback()
        log.error(f"Failed to update conversation: {str(e)}")
        return {"error": "Failed to update conversation"}, 500


@router.delete("/conversations/{conversation_id}")
def remove_conversation(conversation_id: int, db: Session = Depends(get_db)):
    return crud.delete_conversation(db, conversation_id)


@router.post("/conversations/new", response_model=schemas.Conversation)
def create_conversation_with_id(
    current_user: Annotated[schemas.User, Depends(get_current_active_user)],
    db: Session = Depends(get_db),
):
    print("Creating new conversation", current_user.id)
    try:
        # Fetch the maximum id
        max_id = db.query(func.max(Conversation.id)).scalar() or 0
        log.info(f"Max id: {max_id}")
        next_id = max_id + 1
        new_conversation = crud.create_conversation_with_id(
            db=db,
            conversation_data=schemas.ConversationCreate(
                user_id=current_user.id,
                context=[],
                created_at=datetime.utcnow(),
                id=next_id,
            ),
        )
        db.add(new_conversation)
        db.commit()
        return new_conversation
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Conversation with this ID already exists"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
