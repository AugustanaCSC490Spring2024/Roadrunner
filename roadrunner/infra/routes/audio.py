import os
from datetime import datetime
from typing import Dict

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..db.crud import get_all_captures, get_user
from ..db.db import get_db, store_capture_database
from ..models.audiototext import audio_to_text
from ..models.llm import LLMClient
from ..utils.audio import save_audio_file

llm_client = LLMClient()

router = APIRouter()


@router.get("/captures/")
def get_captures(db: Session = Depends(get_db)):
    captures = get_all_captures(db)
    return captures


@router.post("/audio")
async def process_audio(
    audio: UploadFile = File(..., description="The audio file to process"),
    user_id: int = Form(..., description="The user ID associated with this audio file"),
    db: Session = Depends(get_db),
) -> Dict[str, str]:
    print("user_id", user_id)
    print("audio", audio)

    db_user = get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        print("Processing audio", audio)
        audio_path = await save_audio_file(audio)
        transcription = audio_to_text(audio_path, plain=True)
        embeddings = llm_client.generate_embeddings(transcription)
        metadata = {"file_name": audio.filename, "recorded_at": datetime.utcnow()}
        print("transcription", transcription["text"])

        await store_capture_database(
            db, user_id, transcription["text"], embeddings, metadata
        )
        return {"message": "Audio processed and stored successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
