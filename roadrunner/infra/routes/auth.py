from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from ..db.crud import fetch_user_by_email, register_user
from ..db.db import get_db
from ..db.models import User
from ..utils.emailvalidator import user_validate_email
from ..utils.password_hash_algorithm import check_password_strength, hash_password
from ..utils.oauth import authenticate_user, create_access_token
from ..db.schemas import Token

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

@router.post("/login")
async def login(form_data: dict, db: Session = Depends(get_db)):
    print("form data", form_data)
    user = authenticate_user(form_data, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.post("/signup")
async def signup(signup_data: dict, db: Session = Depends(get_db)):
    username = signup_data["username"]
    email = signup_data["email"]
    password = signup_data["password"]

    if fetch_user_by_email(db, email):
        raise HTTPException(status_code=400, detail="User already exists!")
    if user_validate_email(email) is None or not check_password_strength(password):
        raise HTTPException(status_code=400, detail="Invalid email or weak password")
    hashed_password = hash_password(password)
    new_user = User(username=username, email=email, hashed_password=hashed_password)
    register_user(db, new_user)
    return {"username": new_user.username, "email": new_user.email, "user_id": new_user.id}


@router.post("/logout")
async def logout():
    return {"message": "Successfully logged out"}
