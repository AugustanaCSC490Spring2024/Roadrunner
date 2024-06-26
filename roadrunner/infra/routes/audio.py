import os
from datetime import datetime
from pathlib import Path
from typing import Dict

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..db.crud import create_embedding, get_all_captures, get_all_embeddings, get_user
from ..db.db import get_db, store_capture_database
from ..models.audiototext import audio_to_text
from ..models.llm import LLMClient
from ..utils.audio import save_audio_file

# Path on the same root as database
ASSETS_PATH = "roadrunner/assets/"

llm_client = LLMClient()

router = APIRouter()


@router.get("/captures/")
def get_captures(db: Session = Depends(get_db)):
    captures = get_all_captures(db)
    return captures


@router.get("/embeddings/")
def get_embeddings(db: Session = Depends(get_db)):
    embeddings = get_all_embeddings(db)
    return embeddings


@router.post("/audio")
async def process_audio(
    audio: UploadFile = File(..., description="The audio file to process"),
    user_id: int = Form(..., description="The user ID associated with this audio file"),
    recorded_at: datetime = Form(
        ..., description="The date and time the audio was recorded"
    ),
    db: Session = Depends(get_db),
) -> Dict[str, str]:

    print("user_id", user_id)
    print("recorded_at", recorded_at)
    print("audio", audio)

    db_user = get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        print("Processing audio", audio)
        audio_path = await save_audio_file(audio)
        transcription = audio_to_text(audio_path, plain=True)
        embeddings = llm_client.generate_embeddings(transcription)
        create_embedding(
            db,
            user_id=db_user.id,
            text=transcription["text"],
            vector=embeddings,
            created_at=recorded_at,
        )
        metadata = {"file_name": audio.filename, "recorded_at": recorded_at}

        # creating text file and save to assets folder
        text_path = Path(
            os.path.join(ASSETS_PATH, "text/", f"{audio.filename}.txt")
        ).resolve()
        with open(text_path, "w", encoding="utf-8") as txt:
            print(f"\nCreating text file ❗️")
            txt.write(transcription["text"])

        await store_capture_database(
            db, user_id, transcription["text"], embeddings, metadata
        )
        return {"message": "Audio processed and stored successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
