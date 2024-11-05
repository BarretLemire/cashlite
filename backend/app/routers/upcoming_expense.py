# app/routers/upcoming_expense.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.database import get_db
from app.auth import get_current_active_user

router = APIRouter()

@router.post("/upcoming_expenses/")
def create_upcoming_expense(upcoming_expense: schemas.UpcomingExpenseCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    return crud.create_upcoming_expense(db=db, user_id=current_user.id, **upcoming_expense.dict())

@router.get("/upcoming_expenses/")
def read_upcoming_expenses(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    return crud.get_upcoming_expenses_by_user(db=db, user_id=current_user.id)

@router.delete("/upcoming_expenses/{upcoming_expense_id}")
def delete_upcoming_expense(upcoming_expense_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    success = crud.delete_upcoming_expense(db=db, upcoming_expense_id=upcoming_expense_id)
    if not success:
        raise HTTPException(status_code=404, detail="Upcoming Expense not found")
    return {"detail": "Upcoming Expense deleted"}
