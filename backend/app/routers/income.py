# app/routers/income.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db

router = APIRouter()

@router.post("/")
def create_income(user_id: int, amount: float, category: str, db: Session = Depends(get_db)):
    return crud.create_income(db=db, user_id=user_id, amount=amount, category=category)

@router.get("/{user_id}")
def read_incomes(user_id: int, db: Session = Depends(get_db)):
    return crud.get_incomes_by_user(db=db, user_id=user_id)

@router.delete("/{income_id}", response_model=dict)
def delete_income(income_id: int, db: Session = Depends(get_db)):
    success = crud.delete_income(db, income_id=income_id)
    if not success:
        raise HTTPException(status_code=404, detail="Income not found")
    return {"detail": "Income deleted successfully"}