import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext'; // Import DarkModeContext
import './Upcoming.css';

import penIcon from '../assets/pen.svg';
import deleteIcon from '../assets/delete.svg';
import saveIcon from '../assets/save.svg';
import addIcon from '../assets/add.svg';

const UpcomingPage = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext); // Get dark mode state
  const [isEditMode, setEditMode] = useState(false);
  const [remainingTotal, setRemainingTotal] = useState(1000);
  const [irregularExpenses, setIrregularExpenses] = useState([
    { id: 1, amount: 200, category: "Camping Trip" },
    { id: 2, amount: 200, category: "Car Parts" },
  ]);

  const navigate = useNavigate();

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

  const handleDeleteItem = (id: number) => {
    setIrregularExpenses(irregularExpenses.filter(item => item.id !== id));
  };

  const handleInputChange = (id: number, value: number) => {
    if (isNaN(value)) return;
    setIrregularExpenses(irregularExpenses.map(item => (item.id === id ? { ...item, amount: value } : item)));
  };

  return (
    <div className={`upcoming-container ${darkMode ? 'dark-mode' : ''}`}>
      <aside className="sidebar">
        <nav>
          <ul>
            <li><a href="/">Dashboard</a></li>
            <li><a href="/upcoming">Remaining/Upcoming</a></li>
            <li><a href="/calendar">Calendar</a></li>
            {/* Dark Mode Toggle Button */}
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
          {irregularExpenses.map((item) => (
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
                  onClick={() => handleDeleteItem(item.id)}
                />
              )}
            </div>
          ))}

          <button className="add-category-btn">
            <img src={addIcon} alt="Add" className="add-icon" /> Add Upcoming Expense
          </button>
        </section>
      </div>
    </div>
  );
};

export default UpcomingPage;
