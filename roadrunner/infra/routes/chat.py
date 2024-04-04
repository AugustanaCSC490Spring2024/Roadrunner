from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from ..db.db import get_db, store_conversation
from ..models.llm import LLMClient

router = APIRouter()

llm_client = LLMClient()


@router.post("/chat")
async def chat(request: Request, db: Session = Depends(get_db)):
    try:
        request = await request.json()
        embeddings = llm_client.generate_embeddings(request["message"])
        prompt = f"User: {request['message']}\nAssistant:"
        print("prompt", prompt)
        response = llm_client.generate_completion(prompt)
        await store_conversation(db, request["user_id"], request["message"], response)
        return {"response": response}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
