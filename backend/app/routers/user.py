# app/routers/user.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.database import get_db
from app.auth import get_current_user, get_current_active_user
from app.auth import hash_password

router = APIRouter()

@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = hash_password(user.password)
    return crud.create_user(db=db, email=user.email, hashed_password=hashed_password)

@router.get("/users/me/", response_model=schemas.User)
def read_current_user(current_user: models.User = Depends(get_current_active_user)):
    return current_user
