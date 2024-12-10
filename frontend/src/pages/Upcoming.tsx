import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext';
import './Upcoming.css';

import penIcon from '../assets/pen.svg';
import deleteIcon from '../assets/delete.svg';
import addIcon from '../assets/add.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const UpcomingPage = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isEditMode, setEditMode] = useState(false);
  const [remainingTotal, setRemainingTotal] = useState(0); // Initialize dynamically
  const [upcomingExpenses, setUpcomingExpenses] = useState([]);
  const [newExpenseVisible, setNewExpenseVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    date: '',
    description: '',
  });

  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null); // Ref for the add-expense container

  useEffect(() => {
    const fetchUpcomingExpenses = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/upcoming_expenses/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUpcomingExpenses(data);
        } else {
          console.error('Failed to fetch upcoming expenses.');
        }
      } catch (error) {
        console.error('Error fetching upcoming expenses:', error);
      }
    };

    const fetchTotals = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const incomeResponse = await fetch(`${API_BASE_URL}/incomes/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const expenseResponse = await fetch(`${API_BASE_URL}/expenses/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (incomeResponse.ok && expenseResponse.ok) {
          const incomes = await incomeResponse.json();
          const expenses = await expenseResponse.json();

          const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
          const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

          const calculatedTotal = totalIncome - totalExpenses;

          const savedRemainingTotal = localStorage.getItem('remainingTotal');
          const finalTotal = savedRemainingTotal !== null ? parseFloat(savedRemainingTotal) : calculatedTotal;

          setRemainingTotal(finalTotal);
          localStorage.setItem('remainingTotal', finalTotal.toString());
        } else {
          console.error('Failed to fetch totals.');
        }
      } catch (error) {
        console.error('Error fetching totals:', error);
      }
    };

    fetchUpcomingExpenses();
    fetchTotals();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setNewExpenseVisible(false); // Hide the fields when clicked outside
      }
    };

    if (newExpenseVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [newExpenseVisible]);

  const toggleEditMode = () => {
    setEditMode(!isEditMode);
  };

  const handleAssignDate = (expense) => {
    localStorage.setItem('selectedExpense', JSON.stringify(expense));
    navigate('/calendar');
  };

  const handleAllocate = (expense) => {
    const updatedTotal = remainingTotal - expense.amount;
    setRemainingTotal(updatedTotal);
    localStorage.setItem('remainingTotal', updatedTotal.toString());
  };

  const handleDeleteExpense = async (id) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/upcoming_expenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setUpcomingExpenses((prev) => prev.filter((item) => item.id !== id));
      } else {
        console.error('Failed to delete expense.');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleAddExpense = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/upcoming_expenses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
          date: newExpense.date,
          description: newExpense.description,
        }),
      });

      if (response.ok) {
        const createdExpense = await response.json();
        setUpcomingExpenses((prev) => [...prev, createdExpense]);
        setNewExpense({ amount: '', category: '', date: '', description: '' });
        setNewExpenseVisible(false);
      } else {
        console.error('Failed to add new expense.');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className={`upcoming-container ${darkMode ? 'dark-mode' : ''}`}>
      <aside className="sidebar">
        <nav>
          <ul>
            <li><a href="/">Dashboard</a></li>
            <li><a href="/upcoming">Remaining/Upcoming</a></li>
            <li><a href="/calendar">Calendar</a></li>
            <li>
              <a href="#" onClick={toggleDarkMode}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="content">
        <section className="upcoming-section">
          <img src={penIcon} alt="Edit" onClick={toggleEditMode} className="edit-icon" />
          <div className="remaining-total">
            <h2>Remaining Total</h2>
            <input
              type="number"
              value={remainingTotal}
              readOnly
              min="0"
            />
          </div>

          <h2>Upcoming Expenses</h2>
          {upcomingExpenses.map((item) => (
            <div key={item.id} className="expense-item">
              <input
                type="number"
                value={item.amount}
                readOnly={!isEditMode}
                min="0"
              />
              <span>{item.category}</span>

              {!isEditMode && (
                <div className="action-buttons">
                  <button className="allocate-btn" onClick={() => handleAllocate(item)}>Allocate</button>
                  <button className="assign-btn" onClick={() => handleAssignDate(item)}>Assign Date</button>
                </div>
              )}

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
            <div className="add-expense" ref={formRef}>
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
              <input
                type="date"
                placeholder="Date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className={darkMode ? 'dark-input input-field' : 'input-field'}
              />
              <input
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
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

          <button className="add-category-btn" onClick={() => setNewExpenseVisible(true)}>
            <img src={addIcon} alt="Add" className="add-icon" /> Add Upcoming Expense
          </button>
        </section>
      </div>
    </div>
  );
};

export default UpcomingPage;
