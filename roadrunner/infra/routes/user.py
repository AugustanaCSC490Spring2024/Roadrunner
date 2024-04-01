from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import crud, models, schemas
from ..db.db import get_db

router = APIRouter()

@router.post("/users/", response_model=schemas.User)
def register_user_endpoint(user: schemas.UserCreate, db: Session = Depends(get_db)):
    print('user', user)
    db_user = crud.fetch_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.register_user(db=db, user=user)

@router.get("/users/{user_id}", response_model=schemas.User)
def get_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user