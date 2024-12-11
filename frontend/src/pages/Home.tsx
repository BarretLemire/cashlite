import React, { useContext, useState, useEffect, useRef } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';
import './Home.css';

import penIcon from '../assets/pen.svg';
import deleteIcon from '../assets/delete.svg';
import addIcon from '../assets/add.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

interface IncomeItem {
  id: number; 
  amount: number;
  category: string;
}

interface ExpenseItem {
  id: number;
  amount: number;
  category: string;
}

const HomePage: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const darkModeContext = useContext(DarkModeContext);
if (!darkModeContext) {
  throw new Error('DarkModeContext must be used within a DarkModeProvider');
}
  const { darkMode, toggleDarkMode } = darkModeContext;
  const [isEditMode, setEditMode] = useState(false);
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([]);
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [newIncomeVisible, setNewIncomeVisible] = useState(false);
  const [newExpenseVisible, setNewExpenseVisible] = useState(false);
  const [newIncome, setNewIncome] = useState({ amount: '', category: '' });
  const [newExpense, setNewExpense] = useState({ amount: '', category: '' });
  

  const incomeRef = useRef<HTMLDivElement>(null);
  const expenseRef = useRef<HTMLDivElement>(null);

  // Fetch income and expense data when the user logs in
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIncomeItems([]);
        setExpenseItems([]);
        return;
      }

      try {
        const incomeResponse = await fetch(`${API_BASE_URL}/incomes/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const expenseResponse = await fetch(`${API_BASE_URL}/expenses/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (incomeResponse.ok && expenseResponse.ok) {
          const incomes = await incomeResponse.json();
          const expenses = await expenseResponse.json();
          setIncomeItems(incomes);
          setExpenseItems(expenses);
        } else {
          console.error('Failed to fetch income/expense data.');
        }
      } catch (error) {
        console.error('Error fetching income/expense data:', error);
      }
    };

    if (isLoggedIn) {
      fetchData();
    } else {
      setIncomeItems([]);
      setExpenseItems([]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
  
      if (
        newIncomeVisible &&
        incomeRef.current &&
        !incomeRef.current.contains(target)
      ) {
        setNewIncomeVisible(false);
      }
  
      if (
        newExpenseVisible &&
        expenseRef.current &&
        !expenseRef.current.contains(target)
      ) {
        setNewExpenseVisible(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [newIncomeVisible, newExpenseVisible]);

  const handleAddIncome = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('User not logged in. Cannot add income.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/incomes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(newIncome.amount),
          category: newIncome.category,
        }),
      });

      if (response.ok) {
        const createdIncome: IncomeItem = await response.json();
        setIncomeItems((prevItems) => [...prevItems, createdIncome]);
        setNewIncome({ amount: '', category: '' });
        setNewIncomeVisible(false);
      } else {
        console.error('Failed to add new income.');
      }
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const handleAddExpense = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('User not logged in. Cannot add expense.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/expenses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
        }),
      });

      if (response.ok) {
        const createdExpense = await response.json();
        setExpenseItems((prevItems) => [...prevItems, createdExpense]);
        setNewExpense({ amount: '', category: '' });
        setNewExpenseVisible(false);
      } else {
        console.error('Failed to add new expense.');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteIncome = async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/incomes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIncomeItems((prevItems) => prevItems.filter((item) => item.id !== id));
        console.log('Income deleted successfully');
      } else {
        console.error('Failed to delete income.');
      }
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setExpenseItems((prevItems) => prevItems.filter((item) => item.id !== id));
        console.log('Expense deleted successfully');
      } else {
        console.error('Failed to delete expense.');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!isEditMode);
  };

  const totalIncome = incomeItems.reduce((total, item) => total + item.amount, 0);
  const totalExpenses = expenseItems.reduce((total, item) => total + item.amount, 0);


  return (
    <div className={`home-container ${darkMode ? 'dark-mode' : ''}`}>
      <aside className="sidebar">
        <nav>
          <ul>
            <li><a href="/">Dashboard</a></li>
            <li><a href="/upcoming">Remaining/Upcoming</a></li>
            <li><a href="/calendar">Calendar</a></li>
            <li><a href="#" onClick={toggleDarkMode}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </a></li>
          </ul>
        </nav>
      </aside>

      <div className="content">
        {/* Income Section */}
        <section className="income-section">
          <img src={penIcon} alt="Edit" onClick={toggleEditMode} className="edit-icon" />
          <h2>Income</h2>
          {incomeItems.map((item) => (
            <div key={item.id} className="income-item">
              <input
                type="number"
                value={item.amount}
                readOnly={!isEditMode}
              />
              <span>{item.category}</span>
              {isEditMode && (
                <img
                  src={deleteIcon}
                  alt="Delete"
                  className="delete-icon"
                  onClick={() => handleDeleteIncome(item.id)}
                />
              )}
            </div>
          ))}

          {newIncomeVisible && (
            <div className="add-income" ref={incomeRef}>
              <input
                type="number"
                placeholder="Amount"
                value={newIncome.amount}
                onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                className={darkMode ? 'dark-input input-field' : 'input-field'}
              />
              <input
                type="text"
                placeholder="Category"
                value={newIncome.category}
                onChange={(e) => setNewIncome({ ...newIncome, category: e.target.value })}
                className={darkMode ? 'dark-input input-field' : 'input-field'}
              />
              <button
                onClick={handleAddIncome}
                className={darkMode ? 'modal-btn dark-btn' : 'modal-btn'}
              >
                Save Income
              </button>
            </div>
          )}

          <div className="total-field">
            <label>Total Income</label>
            <input type="number" value={totalIncome} readOnly />
          </div>

          <button className="add-category-btn" onClick={() => setNewIncomeVisible(true)}>
            <img src={addIcon} alt="Add" className="add-icon" /> Add Income
          </button>
        </section>

        {/* Expenses Section */}
        <section className="expense-section">
          <img src={penIcon} alt="Edit" onClick={toggleEditMode} className="edit-icon" />
          <h2>Expenses</h2>
          {expenseItems.map((item) => (
            <div key={item.id} className="expense-item">
              <input
                type="number"
                value={item.amount}
                readOnly={!isEditMode}
              />
              <span>{item.category}</span>
              {isEditMode && (
                <img
                  src={deleteIcon}
                  alt="Delete"
                  className="delete-icon"
                  onClick={() => handleDeleteExpense(item.id)}
                />
              )}
            </div>
          ))}

          {newExpenseVisible && (
            <div className="add-expense" ref={expenseRef}>
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className={darkMode ? 'dark-input input-field' : 'input-field'}
              />
              <input
                type="text"
                placeholder="Category"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className={darkMode ? 'dark-input input-field' : 'input-field'}
              />
              <button
                onClick={handleAddExpense}
                className={darkMode ? 'modal-btn dark-btn' : 'modal-btn'}
              >
                Save Expense
              </button>
            </div>
          )}

          <div className="total-field">
            <label>Total Expenses</label>
            <input type="number" value={totalExpenses} readOnly />
          </div>

          <button className="add-category-btn" onClick={() => setNewExpenseVisible(true)}>
            <img src={addIcon} alt="Add" className="add-icon" /> Add Expense
          </button>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
