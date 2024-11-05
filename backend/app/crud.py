from sqlalchemy.orm import Session
from . import models
from datetime import date
from typing import Optional

# Expense CRUD
def create_expense(db: Session, user_id: int, amount: float, category: str):
    db_expense = models.Expense(amount=amount, category=category, user_id=user_id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_expenses_by_user(db: Session, user_id: int):
    return db.query(models.Expense).filter(models.Expense.user_id == user_id).all()

def get_expense_by_id(db: Session, expense_id: int):
    return db.query(models.Expense).filter(models.Expense.id == expense_id).first()

def get_expense(db: Session, expense_id: int):
    return db.query(models.Expense).filter(models.Expense.id == expense_id).first()

def update_expense(db: Session, expense_id: int, amount: Optional[float] = None, category: Optional[str] = None):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if not expense:
        return None
    if amount is not None:
        expense.amount = amount
    if category is not None:
        expense.category = category
    db.commit()
    db.refresh(expense)
    return expense

def delete_expense(db: Session, expense_id: int):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    print(f"Queried expense for deletion: {expense}")
    if expense:
        db.delete(expense)
        db.commit()
        print("Deletion committed successfully.")
        return True
    print("No expense found to delete.")
    return False

# Income CRUD
def create_income(db: Session, user_id: int, amount: float, category: str):
    db_income = models.Income(amount=amount, category=category, user_id=user_id)
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income

def get_incomes_by_user(db: Session, user_id: int):
    return db.query(models.Income).filter(models.Income.user_id == user_id).all()

def get_income_by_id(db: Session, income_id: int):
    return db.query(models.Income).filter(models.Income.id == income_id).first()

def update_income(db: Session, income_id: int, amount: Optional[float] = None, category: Optional[str] = None):
    income = db.query(models.Income).filter(models.Income.id == income_id).first()
    if not income:
        return None
    if amount is not None:
        income.amount = amount
    if category is not None:
        income.category = category
    db.commit()
    db.refresh(income)
    return income

def delete_income(db: Session, income_id: int):
    income = db.query(models.Income).filter(models.Income.id == income_id).first()
    if income:
        db.delete(income)
        db.commit()
        return True
    return False

#UpcomingExpense CRUD

def create_upcoming_expense(db: Session, user_id: int, date: date, description: str, amount: float, category: Optional[str] = None):
    db_upcoming_expense = models.UpcomingExpense(
        date=date, 
        description=description,
        amount=amount, 
        category=category,
        user_id=user_id
    )
    db.add(db_upcoming_expense)
    db.commit()
    db.refresh(db_upcoming_expense)
    return db_upcoming_expense

def get_upcoming_expenses_by_user(db: Session, user_id: int):
    return db.query(models.UpcomingExpense).filter(models.UpcomingExpense.user_id == user_id).all()

def get_upcoming_expense_by_id(db: Session, upcoming_expense_id: int):
    return db.query(models.UpcomingExpense).filter(models.UpcomingExpense.id == upcoming_expense_id).first()

def update_upcoming_expense(db: Session, upcoming_expense_id: int, date: Optional[date] = None, description: Optional[str] = None, amount: Optional[float] = None, category: Optional[str] = None):
    upcoming_expense = db.query(models.UpcomingExpense).filter(models.UpcomingExpense.id == upcoming_expense_id).first()
    if not upcoming_expense:
        return None
    if date is not None:
        upcoming_expense.date = date
    if description is not None:
        upcoming_expense.description = description
    if amount is not None:
        upcoming_expense.amount = amount
    if category is not None:
        upcoming_expense.category
    db.commit()
    db.refresh(upcoming_expense)
    return upcoming_expense

def delete_upcoming_expense(db: Session, upcoming_expense_id: int):
    upcoming_expense = db.query(models.UpcomingExpense).filter(models.UpcomingExpense.id == upcoming_expense_id).first()
    if upcoming_expense:
        db.delete(upcoming_expense)
        db.commit()
        return True
    return False

# User CRUD - For completeness
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, email: str, hashed_password: str):
    db_user = models.User(email=email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
