from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models, crud
from app.database import get_db
from app.auth import get_current_active_user

router = APIRouter()

# Route to create a new income
@router.post("/", response_model=schemas.Income)
def create_income(
    income: schemas.IncomeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    return crud.create_income(db=db, income=income, user_id=current_user.id)

# Route to read all incomes for the current user
@router.get("/", response_model=list[schemas.Income])
def read_incomes(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_active_user),
):
    return crud.get_incomes_by_user(db=db, user_id=current_user.id)

# Route to delete a specific income by ID
@router.delete("/{income_id}", response_model=dict)
def delete_income(
    income_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    success = crud.delete_income(db, income_id=income_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Income not found")
    return {"detail": "Income deleted successfully"}
