import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext';
import './Upcoming.css';

import penIcon from '../assets/pen.svg';
import deleteIcon from '../assets/delete.svg';
import saveIcon from '../assets/save.svg';
import addIcon from '../assets/add.svg';

const API_BASE_URL = 'http://127.0.0.1:8000';

const UpcomingPage = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isEditMode, setEditMode] = useState(false);
  const [remainingTotal, setRemainingTotal] = useState(1000);
  const [upcomingExpenses, setUpcomingExpenses] = useState([]);
  const [newExpenseVisible, setNewExpenseVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    date: '', // Added date field
    description: '', // Added description field
  });

  const navigate = useNavigate();

  // Fetch upcoming expenses from the backend
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

    fetchUpcomingExpenses();
  }, []);

  const toggleEditMode = () => {
    setEditMode(!isEditMode);
  };

  const handleAssignDate = (expense) => {
    localStorage.setItem('selectedExpense', JSON.stringify(expense));
    navigate('/calendar');
  };

  const handleAllocate = (expense) => {
    setRemainingTotal(remainingTotal - expense.amount);
  };

  const handleDeleteExpense = async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/upcoming_expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUpcomingExpenses((prevItems) => prevItems.filter((item) => item.id !== id));
        console.log('Expense deleted successfully');
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
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
          date: newExpense.date, // Include date
          description: newExpense.description, // Include description
        }),
      });

      if (response.ok) {
        const createdExpense = await response.json();
        setUpcomingExpenses((prevItems) => [...prevItems, createdExpense]);
        setNewExpense({ amount: '', category: '', date: '', description: '' });
        setNewExpenseVisible(false);
      } else {
        console.error('Failed to add new expense.');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleInputChange = (id: number, value: number) => {
    if (isNaN(value)) return;
    setUpcomingExpenses(upcomingExpenses.map((item) => (item.id === id ? { ...item, amount: value } : item)));
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
          <img src={saveIcon} alt="Save" className="save-icon" onClick={() => setEditMode(false)} />

          <div className="remaining-total">
            <h2>Remaining Total</h2>
            <input
              type="number"
              value={remainingTotal}
              readOnly={!isEditMode}
              min="0"
            />
          </div>

          <h2>Upcoming Expenses</h2>
          {upcomingExpenses.map((item) => (
            <div key={item.id} className="expense-item">
              <input
                type="number"
                value={item.amount}
                onChange={(e) => handleInputChange(item.id, parseFloat(e.target.value))}
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
            <div className="add-expense">
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
