import asyncio
import datetime
import json
import os
import traceback
from typing import List

from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from infra.db.crud import (
    add_message_to_conversation,
    create_conversation,
    get_conversation,
)
from infra.db.embeddings import get_relevant_records
from infra.db.schemas import (
    ChatRequest,
    ConversationCreate,
    UpdateConversationRequest,
)
from infra.utils import logger

from ..db.db import get_db
from ..models.llm import LLMClient

log = logger.get_logger(__name__)


router = APIRouter()

llm_client = LLMClient()


@router.post("/chat")
async def chat(request: ChatRequest, db: Session = Depends(get_db)):

    log.info(f"User conversation id: {request.conversation_id}")
    log.info(f"User message: {request.message}")
    log.info(f"User id: {request.user_id}")

    # get conversation
    conversation = get_conversation(db, request.conversation_id)
    log.info(f"Conversation: {conversation}")
    if not conversation:
        log.info("No conversation found, creating new one")
        conversation = create_conversation(
            db, ConversationCreate(user_id=request.user_id, context=[])
        )

    log.info(f"Conversation id: {conversation.id}")
    chat_messages = conversation.context

    # add the current user message
    user_message = {
        "role": "user",
        "content": request.message,
    }
    relevant_records = await get_relevant_records(db, request.message)
    # log.info(f"Relevant records: {relevant_records}")

    messages = (
        [llm_client.get_system_message(relevant_records)]
        + chat_messages
        + [user_message]
    )

    # log.info(f"Chat messages: {messages}")

    try:
        stream = await llm_client.async_completion(messages)

        async def generator():
            async for chunk in stream:
                print(chunk.choices[0].delta.content)
                yield json.dumps(chunk.choices[0].delta.content or "")

        response_messages = generator()
        return StreamingResponse(response_messages, media_type="text/event-stream")
    except Exception as e:
        print(f"error occurred: {traceback.format_exc()}")


@router.post("/update-conversation")
async def update_conversation(
    update_request: UpdateConversationRequest, db: Session = Depends(get_db)
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
        conversation = get_conversation(db, conversation_id)
        if not conversation:
            log.error(f"No conversation found with ID {conversation_id}")
            return {"error": "Conversation not found"}, 404

        add_message_to_conversation(
            db=db, conversation_id=conversation_id, messages=messages
        )
        db.commit()
        log.info(f"Updated conversation {conversation_id} with new messages.")
        return {"message": "Conversation updated successfully"}, 200
    except Exception as e:
        db.rollback()
        log.error(f"Failed to update conversation: {str(e)}")
        return {"error": "Failed to update conversation"}, 500
