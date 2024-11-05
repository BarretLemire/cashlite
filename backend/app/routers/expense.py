from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud, models
from app.database import get_db
from typing import List
from app.auth import get_current_user

router = APIRouter()

@router.post("/expenses/", response_model=schemas.Expense)
def create_expense(expense: schemas.ExpenseCreate, 
                   db: Session = Depends(get_db),
                   current_user: models.User = Depends(get_current_user)
                   ):
    return crud.create_expense(db=db,
                               user_id=current_user.id,
                               amount=expense.amount,
                               category=expense.category
                               )

@router.get("/expenses/{user_id}", response_model=List[schemas.Expense])
def get_expenses(user_id: int, db: Session = Depends(get_db)):
    return crud.get_expenses_by_user(db=db, user_id=user_id)

#@router.delete("/{expense_id}", response_model=dict)
#def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    #print(f"DELETE request recieved for expense ID: {expense_id}")
    #expense = crud.get_expense(db, expense_id=expense_id)
    #if expense:
        #crud.delete_expense(db, expense_id=expense_id)
        #return{"success": True}
    #return {"success": False}

@router.delete("/{expense_id}", response_model=dict)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    print(f"Attempting to delete expense with ID: {expense_id}")
    success = crud.delete_expense(db, expense_id=expense_id)
    print(f"Deletion success status: {success}")
    return {"success": success}

