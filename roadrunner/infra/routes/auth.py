from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..db.crud import fetch_user_by_email, register_user
from ..db.db import get_db
from ..db.models import User
from ..db.schemas import Token, UserLogin
from ..utils.emailvalidator import user_validate_email
from ..utils.oauth import (
    authenticate_user,
    create_access_token,
    get_current_active_user,
)
from ..utils.password_hash_algorithm import check_password_strength, hash_password

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
ACCESS_TOKEN_EXPIRE_MINUTES = 30


@router.post("/login")
async def login(form_data: UserLogin, db: Session = Depends(get_db)):
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
    return {
        "user_id": user.id,
        "access_token": access_token,
        "token_type": "bearer",
    }


# @router.options("/login")
# async def login_options():
#     return {"Allow": "POST, OPTIONS"}


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
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.post("/logout")
async def logout():
    return {"message": "Successfully logged out"}
