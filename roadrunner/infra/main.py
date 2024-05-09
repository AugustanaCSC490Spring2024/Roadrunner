import uvicorn
import os
from fastapi import FastAPI

from .db.db import database, engine, metadata
from .db.models import Base
from .routes.audio import router as audio_router
from .routes.auth import router as auth_router
from .routes.chat import router as chat_router
from .routes.conversation import router as conversation_router
from .routes.user import router as user_router

app = FastAPI()

app.include_router(user_router)
app.include_router(audio_router)
app.include_router(chat_router)
app.include_router(conversation_router)
app.include_router(auth_router)


@app.get("/")
async def root():
    return "Hello from roadrunner"


Base.metadata.create_all(bind=engine)


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


port = int(os.environ.get('PORT', 8080))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=port)
