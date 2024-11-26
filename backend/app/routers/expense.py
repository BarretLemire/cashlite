from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud, models
from app.database import get_db
from app.auth import get_current_active_user
from typing import List

router = APIRouter()

# Route to create a new expense
@router.post("/", response_model=schemas.Expense)
def create_expense(
    expense: schemas.ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    return crud.create_expense(
        db=db,
        user_id=current_user.id,
        amount=expense.amount,
        category=expense.category,
    )

# Route to read all expenses for the current user
@router.get("/", response_model=List[schemas.Expense])
def read_expenses(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    return crud.get_expenses_by_user(db=db, user_id=current_user.id)

# Route to delete a specific expense by ID
@router.delete("/{expense_id}", response_model=dict)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    print(f"Attempting to delete expense with ID: {expense_id}")
    # Ensure the expense belongs to the current user
    expense = crud.get_expense(db, expense_id=expense_id)
    if not expense or expense.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Expense not found or unauthorized")
    success = crud.delete_expense(db, expense_id=expense_id)
    print(f"Deletion success status: {success}")
    return {"success": success}
