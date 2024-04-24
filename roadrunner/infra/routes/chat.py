import asyncio
import datetime
import json
import os
import traceback
from typing import List

from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from roadrunner.infra.db.crud import (
    add_message_to_conversation,
    create_conversation,
    get_conversation,
)
from roadrunner.infra.db.schemas import (
    ChatRequest,
    ConversationBase,
    ConversationCreate,
)
from roadrunner.infra.utils import logger

from ..db.db import get_db, store_conversation
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
        conversation = create_conversation(
            db, ConversationCreate(user_id=request.user_id, context=[])
        )

    log.info(f"Conversation id: {conversation.id}")
    chat_messages = conversation.context

    # Add the current user message
    user_message = {
        "role": "user",
        "content": request.message,
    }
    chat_messages.append(user_message)
    log.info(f"Chat messages: {chat_messages}")

    try:
        stream = await llm_client.async_completion(chat_messages)

        async def generator():
            async for chunk in stream:
                print(chunk.choices[0].delta.content)
                yield json.dumps(chunk.choices[0].delta.content or "")

        response_messages = generator()
        return StreamingResponse(response_messages, media_type="text/event-stream")
    except Exception as e:
        print(f"error occurred: {traceback.format_exc()}")

    # # Prepare response to the user
    # new_message_data = [
    #     user_message,
    #     {"role": "assistant", "content": response, "timestamp": datetime.now()},
    # ]

    # # Save to database
    # db_message = add_message_to_conversation(
    #     db=db, conversation_id=conversation.id, messages=new_message_data
    # )
    # log.info(f"Conversation message id {db_message.id} saved to database")

    # prompt = f"User: {request_data['message']}\nAssistant:"

    # await store_conversation(
    #     db, request_data["user_id"], request_data["message"]
    # )
    # try:
    #     stream = await llm_client.async_completion(prompt)

    #     async def generator():
    #         async for chunk in stream:
    #             print(chunk.choices[0].delta.content)
    #             yield json.dumps(chunk.choices[0].delta.content or "")

    #     response_messages = generator()
    #     return StreamingResponse(response_messages, media_type="text/event-stream")
    # except Exception as e:
    #     print(f"error occurred: {traceback.format_exc()}")
    #     pass


@router.post("/update-conversation")
async def update_conversation(
    conversation_id: int, messages: List[dict], db: Session = Depends(get_db)
):
    """
    Update the conversation with new messages.
    :param conversation_id: ID of the conversation to update.
    :param messages: List of message dictionaries to add to the conversation.
    :param db: Database session dependency.
    """
    try:
        # Retrieve the existing conversation
        conversation = get_conversation(db, conversation_id)
        if not conversation:
            log.error(f"No conversation found with ID {conversation_id}")
            return {"error": "Conversation not found"}, 404

        # Add new messages to the conversation
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
