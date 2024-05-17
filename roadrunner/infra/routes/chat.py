import asyncio
import datetime
import json
import os
import traceback
from typing import List, Annotated

from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from infra.db.crud import (
    add_message_to_conversation,
    create_conversation,
    get_all_conversations_by_user,
    get_conversation,
    get_all_messages_by_user
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
from ..utils.oauth import get_current_active_user
from ..db.schemas import User

log = logger.get_logger(__name__)


router = APIRouter()

llm_client = LLMClient()


@router.post("/chat")
async def chat(current_user: Annotated[User, Depends(get_current_active_user)], request: ChatRequest, db: Session = Depends(get_db)):

    log.info(f"User conversation id: {request.conversation_id}")
    log.info(f"User message: {request.message}")
    log.info(f"User id: {current_user.id}")

    # get conversation
    conversation = get_conversation(db, request.conversation_id)
    log.info(f"Conversation: {conversation}")
    if not conversation:
        log.info("No conversation found, creating new one")
        conversation = create_conversation(
            db, ConversationCreate(user_id=current_user.id, context=[])
        )

    log.info(f"Conversation id: {conversation.id}")
    chat_messages = conversation.context

    # add the current user message
    user_message = {
        "role": "user",
        "content": request.message,
    }
    relevant_records = await get_relevant_records(db, request.message)
    log.info(f"Relevant records: {relevant_records}")

    messages = (
        [llm_client.get_system_message(relevant_records)]
        + [chat_messages]
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
