import asyncio
import json
import os
import traceback

from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from ..db.db import get_db, store_conversation
from ..models.llm import LLMClient

router = APIRouter()

llm_client = LLMClient()


@router.post("/chat")
async def chat(request: Request, db: Session = Depends(get_db)):
    try:
        request_data = await request.json()
        prompt = f"User: {request_data['message']}\nAssistant:"
        print("prompt", prompt)

        await store_conversation(
            db, request_data["user_id"], request_data["message"], "response_placeholder"
        )
        try:
            stream = await llm_client.async_completion(prompt)

            async def generator():
                async for chunk in stream:
                    print(chunk.choices[0].delta.content)
                    yield json.dumps(chunk.choices[0].delta.content or "")

            response_messages = generator()
            return StreamingResponse(response_messages, media_type="text/event-stream")
        except Exception as e:
            print(f"error occurred: {traceback.format_exc()}")
            pass
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
