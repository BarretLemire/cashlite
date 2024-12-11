from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.auth import authenticate_user, create_access_token, get_current_user
from app.database import SessionLocal, engine, get_db
from app import crud, models, schemas
from app.routers import income, expense, upcoming_expense, user
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",  # React development server
    "http://127.0.0.1:5173",  # Alternate localhost address
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend origin(s)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(income.router, prefix="/incomes", tags=["incomes"])
app.include_router(expense.router, prefix="/expenses", tags=["expenses"])
app.include_router(upcoming_expense.router, prefix="/upcoming_expenses", tags=["upcoming_expenses"])
app.include_router(user.router, prefix="/users", tags=["users"])


@app.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=400, detail="Incorrect username or password"
        )
    
    # Pass the user ID as part of the payload
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
