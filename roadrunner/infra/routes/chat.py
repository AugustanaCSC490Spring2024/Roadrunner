import asyncio
import datetime
import json
import os
import traceback
from typing import Annotated, List

from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from infra.db.crud import create_conversation_with_id, get_conversation
from infra.db.embeddings import get_relevant_records
from infra.db.schemas import ChatRequest, ConversationCreate
from infra.utils import logger
from sqlalchemy.orm import Session

from ..db.db import get_db
from ..db.schemas import User
from ..models.llm import LLMClient
from ..utils.oauth import get_current_active_user

log = logger.get_logger(__name__)


router = APIRouter()

llm_client = LLMClient()


@router.post("/chat")
async def chat(
    current_user: Annotated[User, Depends(get_current_active_user)],
    request: ChatRequest,
    db: Session = Depends(get_db),
):

    log.info(f"User conversation id: {request.conversation_id}")
    log.info(f"User message: {request.message}")
    log.info(f"User id: {current_user.id}")

    # get conversation
    conversation = get_conversation(db, current_user.id, request.conversation_id)
    log.info(f"Conversation: {conversation}")
    if not conversation:
        log.info("No conversation found, creating new one")
        conversation = create_conversation_with_id(
            db,
            ConversationCreate(
                id=request.conversation_id, user_id=current_user.id, context=[]
            ),
        )

    log.info(f"Conversation id: {conversation.id}")
    chat_messages = conversation.context

    if not isinstance(chat_messages, list):
        chat_messages = json.loads(chat_messages)

    # add the current user message
    user_message = {
        "role": "user",
        "content": request.message,
    }
    relevant_records = await get_relevant_records(db, current_user.id, request.message)
    system_message = llm_client.get_system_message(relevant_records)
    if not isinstance(system_message, list):
        system_message = [system_message]

    messages = system_message + chat_messages + [user_message]

    log.info(f"Chat messages: {messages}")

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
