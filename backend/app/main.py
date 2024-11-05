from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.auth import authenticate_user, create_access_token, get_current_user
from app.database import SessionLocal, engine, get_db
from app import crud, models, schemas
from app.routers import income, expense, upcoming_expense, user

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(income.router, prefix="/incomes", tags=["incomes"])
app.include_router(expense.router, prefix="/expenses", tags=["expenses"])
app.include_router(upcoming_expense.router, prefix="/upcoming_expenses", tags=["upcoming_expenses"]) #Updated
app.include_router(user.router, prefix="/user", tags=["user"])


@app.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=400, detail="Incorrect username or password"
        )
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# @app.post("/incomes/")
# def create_income(user_id: int, amount: float, category: str, db: Session = Depends(get_db)):
#     return crud.create_income(db=db, user_id=user_id, amount=amount, category=category)

# @app.get("/incomes/{user_id}")
# def read_incomes(user_id: int, db: Session = Depends(get_db)):
#     return crud.get_income_by_user(db=db, user_id=user_id)
