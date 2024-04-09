import os
from pathlib import Path
from datetime import datetime
from typing import Dict

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..db.crud import get_all_capture_sessions, get_audio_snippets_by_session, get_user
from ..db.db import get_db, store_capture_database
from ..models.audiototext import audio_to_text
from ..models.llm import LLMClient
from ..utils.audio import save_audio_file

# Path on the same root as database
ASSETS_PATH = "roadrunner/assets/"

llm_client = LLMClient()

router = APIRouter()

@router.get("/capture-sessions/")
def get_capture_sessions(db: Session = Depends(get_db)):
    sessions = get_all_capture_sessions(db)
    return sessions

@router.get("/capture-sessions/{session_id}/audio-snippets/")
def get_audio_snippets(session_id: int, db: Session = Depends(get_db)):
    snippets = get_audio_snippets_by_session(db, session_id)
    if snippets is None:
        raise HTTPException(status_code=404, detail="Audio snippets not found")
    return snippets

@router.post("/audio")
async def process_audio(
    audio: UploadFile = File(..., description="The audio file to process"),
    user_id: int = Form(..., description="The user ID associated with this audio file"),
    db: Session = Depends(get_db)
) -> Dict[str, str]:
    print('user_id', user_id)
    print('audio', audio)
    
    db_user = get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        print("Processing audio", audio)
        audio_path = await save_audio_file(audio)
        transcription = audio_to_text(audio_path, plain=True)
        embeddings = llm_client.generate_embeddings(transcription)
        metadata = {"file_name": audio.filename,
                    "recorded_at": datetime.utcnow()}
        print('text ❗️ ', transcription)
        
        # creating text file and save to assets folder
        text_path = Path(os.path.join(ASSETS_PATH,"text/", f"{audio.filename}.txt")).resolve()
        print(text_path)
        with open(text_path, "w", encoding="utf-8") as txt:
            print(f"\nCreating text file ❗️ ")
            txt.write(transcription["text"])

        await store_capture_database(db, user_id, transcription, embeddings, metadata)
        return {"message": "Audio processed and stored successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
