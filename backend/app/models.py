from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Enum, Boolean
from sqlalchemy.orm import relationship
from .database import Base
import enum


class UpcomingExpense(Base):
    __tablename__ = 'upcoming_expenses'

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)  # Scheduled date for the expense
    description = Column(String)  # Description of the expense
    amount = Column(Float, nullable=False)  # Amount for the expense
    category = Column(String, nullable=True)  # Category for the expense
    user_id = Column(Integer, ForeignKey('users.id'))  # Link to User table

    # Relationship with User
    owner = relationship("User", back_populates="upcoming_expenses")


class Expense(Base):
    __tablename__ = 'expenses'
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    category = Column(String)
    user_id = Column(Integer, ForeignKey('users.id'))

    owner = relationship("User", back_populates="expenses")

class Income(Base):
    __tablename__ = 'incomes'
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    category = Column(String)
    user_id = Column(Integer, ForeignKey('users.id'))

    owner = relationship("User", back_populates="incomes")

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    # Relationships
    upcoming_expenses = relationship("UpcomingExpense", back_populates="owner")
    expenses = relationship("Expense", back_populates="owner")
    incomes = relationship("Income", back_populates="owner")
