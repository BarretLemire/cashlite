from pydantic import BaseModel
from datetime import date
from typing import Optional


class UserBase(BaseModel):
    email: str
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True  # Ensure compatibility with SQLAlchemy models

class IncomeBase(BaseModel):
    amount: float
    category: str

class IncomeCreate(IncomeBase):
    amount: float
    category: str

class Income(IncomeBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

class ExpenseBase(BaseModel):
    amount: float
    category: str

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

class UpcomingExpenseBase(BaseModel):
    date: date
    description: str
    amount: Optional[float] = None
    category: Optional[str] = None

class UpcomingExpenseCreate(UpcomingExpenseBase):
    pass

class UpcomingExpense(UpcomingExpenseBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


