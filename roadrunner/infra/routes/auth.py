from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..db.crud import fetch_user_by_email, fetch_user_by_username, register_user
from ..db.db import get_db
from ..db.models import User
from ..utils.emailvalidator import user_validate_email
from ..utils.password_hash_algorithm import check_password_strength, hash_password

router = APIRouter()


@router.post("/login")
async def login(form_data: dict, db: Session = Depends(get_db)):
    user = fetch_user_by_username(db, form_data["username"])
    print(user.hashed_password)
    print(hash_password(form_data["password"]))
    if not user or not user.hashed_password == hash_password(form_data["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    return {"username": user.username, "email": user.email,  "user_id": user.id}


@router.post("/signup")
async def signup(signup_data: dict, db: Session = Depends(get_db)):
    username = signup_data["username"]
    email = signup_data["email"]
    password = signup_data["password"]

    if fetch_user_by_email(db, email):
        raise HTTPException(status_code=400, detail="User already exists!")
    if user_validate_email(email) is None or not check_password_strength(password):
        raise HTTPException(status_code=4000, detail="Invalid email or weak password")
    hashed_password = hash_password(password)
    new_user = User(username=username, email=email, hashed_password=hashed_password)
    register_user(db, new_user)
    return {"username": new_user.username, "email": new_user.email, "user_id": new_user.id}


@router.post("/logout")
async def logout():
    return {"message": "Successfully logged out"}
