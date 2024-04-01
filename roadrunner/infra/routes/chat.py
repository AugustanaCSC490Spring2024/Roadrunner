from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from ..db.db import get_db, store_conversation
from ..models.llm import LLMClient

router = APIRouter()

llm_client = LLMClient()

@router.post("/chat")
async def chat(request: Request, db: Session = Depends(get_db)):
    try:
        chat_message = await request.json()
        embeddings = llm_client.generate_embeddings(chat_message["text"])
        prompt = f"User: {chat_message['text']}\nEmbeddings: {embeddings}\nAssistant:"
        response = llm_client.generate_completion(prompt)
        await store_conversation(db, chat_message["user_id"], chat_message["text"], response)
        return {"response": response}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
