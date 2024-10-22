import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Upcoming.css';

import penIcon from '../assets/pen.svg';
import deleteIcon from '../assets/delete.svg';
import saveIcon from '../assets/save.svg';
import addIcon from '../assets/add.svg';

const UpcomingPage = () => {
  const [isEditMode, setEditMode] = useState(false);
  const [remainingTotal, setRemainingTotal] = useState(1000); // Example remaining total
  const [irregularExpenses, setIrregularExpenses] = useState([
    { id: 1, amount: 200, category: "Camping Trip" },
    { id: 2, amount: 200, category: "Car Parts" },
  ]);

  const navigate = useNavigate(); // Hook for navigation

  const toggleEditMode = () => {
    setEditMode(!isEditMode); // Toggles between edit and normal mode
  };

  // Handle assigning date by navigating to the calendar and passing expense info
  const handleAssignDate = (expense) => {
    localStorage.setItem('selectedExpense', JSON.stringify(expense)); // Store expense in localStorage
    navigate('/calendar'); // Navigate to the calendar page
  };

  // Handle allocating the expense and subtracting from the remaining total
  const handleAllocate = (expense) => {
    setRemainingTotal(remainingTotal - expense.amount); // Subtract expense amount from remaining total
  };

  const handleDeleteItem = (id: number) => {
    setIrregularExpenses(irregularExpenses.filter(item => item.id !== id));
  };

  const handleInputChange = (id: number, value: number) => {
    if (isNaN(value)) return; // Prevent NaN from breaking the app
    setIrregularExpenses(irregularExpenses.map(item => (item.id === id ? { ...item, amount: value } : item)));
  };

  return (
    <div className="upcoming-container">
      <aside className="sidebar">
        <nav>
          <ul>
            <li><a href="/">Dashboard</a></li>
            <li><a href="/upcoming">Remaining/Upcoming</a></li>
            <li><a href="/calendar">Calendar</a></li>
          </ul>
        </nav>
      </aside>

      <div className="content">
        {/* Unified Upcoming Section */}
        <section className="upcoming-section">
          <img src={penIcon} alt="Edit" onClick={toggleEditMode} className="edit-icon" />
          <img src={saveIcon} alt="Save" className="save-icon" onClick={() => setEditMode(false)} />

          {/* Remaining Total Field */}
          <div className="remaining-total">
            <h2>Remaining Total:</h2>
            <input
              type="number"
              value={remainingTotal}
              readOnly={!isEditMode} // Editable only in edit mode
              min="0" // Prevent negative values
            />
          </div>

          {/* Irregular Expenses Section */}
          <h2>Upcoming Expenses</h2>
          {irregularExpenses.map((item) => (
            <div key={item.id} className="expense-item">
              <input
                type="number"
                value={item.amount}
                onChange={(e) => handleInputChange(item.id, parseFloat(e.target.value))}
                readOnly={!isEditMode} // Editable only in edit mode
                min="0" // Prevent negative values
              />
              <span>{item.category}</span>

              {/* Show "Allocate" and "Assign Date" when not in edit mode */}
              {!isEditMode && (
                <div className="action-buttons">
                  <button className="allocate-btn" onClick={() => handleAllocate(item)}>Allocate</button>
                  <button className="assign-btn" onClick={() => handleAssignDate(item)}>Assign Date</button>
                </div>
              )}

              {/* Show delete icon only when in edit mode */}
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
            <img src={addIcon} alt="Add" className="add-icon" /> Add Irregular Expense
          </button>
        </section>
      </div>
    </div>
  );
};

export default UpcomingPage;
