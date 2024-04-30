import uvicorn
from fastapi import FastAPI

from .db.db import database, engine, metadata
from .db.models import Base
from .routes.audio import router as audio_router
from .routes.chat import router as chat_router
from .routes.user import router as user_router

app = FastAPI()

app.include_router(user_router)
app.include_router(audio_router)
app.include_router(chat_router)


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


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
