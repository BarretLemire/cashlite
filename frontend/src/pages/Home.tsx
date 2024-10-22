import React, { useState } from 'react';
import './Home.css'; 

import penIcon from '../assets/pen.svg';
import deleteIcon from '../assets/delete.svg';
import saveIcon from '../assets/save.svg';
import addIcon from '../assets/add.svg';

const HomePage = () => {
    const [isEditMode, setEditMode] = useState(false);
    const [incomeItems, setIncomeItems] = useState([
      { id: 1, amount: 750, category: "Disability" },
      { id: 2, amount: 2000, category: "Housing Allowance" },
    ]);
    const [expenseItems, setExpenseItems] = useState([
      { id: 1, amount: 240, category: "Gas" },
      { id: 2, amount: 118, category: "Phone" },
    ]);

    // Calculate total income
    const totalIncome = incomeItems.reduce((total, item) => total + item.amount, 0);

    // Calculate total expenses
    const totalExpenses = expenseItems.reduce((total, item) => total + item.amount, 0);

    // Toggle between edit and normal mode
    const toggleEditMode = () => {
      setEditMode(!isEditMode);
    };

    // Exit edit mode by setting isEditMode to false
    const handleSave = () => {
      console.log('Save changes');
      setEditMode(false); // Exit edit mode
    };

    const handleDeleteItem = (id: number, type: 'income' | 'expense') => {
      if (type === 'income') {
        setIncomeItems(incomeItems.filter(item => item.id !== id));
      } else {
        setExpenseItems(expenseItems.filter(item => item.id !== id));
      }
    };

    const handleInputChange = (id: number, value: number, type: 'income' | 'expense') => {
      if (isNaN(value)) return; // Prevent NaN from breaking the app
      if (type === 'income') {
        setIncomeItems(incomeItems.map(item => (item.id === id ? { ...item, amount: value } : item)));
      } else {
        setExpenseItems(expenseItems.map(item => (item.id === id ? { ...item, amount: value } : item)));
      }
    };

    return (
      <div className="home-container">
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
          {/* Income Section */}
          <section className="income-section">
            <img src={penIcon} alt="Edit" onClick={toggleEditMode} className="edit-icon" />
            <img src={saveIcon} alt="Save" className="save-icon" onClick={handleSave} />
            <h2>Income</h2>
            {incomeItems.map((item) => (
              <div key={item.id} className="income-item">
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => handleInputChange(item.id, parseFloat(e.target.value), 'income')}
                  readOnly={!isEditMode} // Editable only in edit mode
                  min="0" // Prevent negative values
                />
                <span>{item.category}</span>
                {isEditMode && (
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    className="delete-icon"
                    onClick={() => handleDeleteItem(item.id, 'income')}
                  />
                )}
              </div>
            ))}

            {/* Total Income Field */}
            <div className="total-field">
              <label>Total Income</label>
              <input type="number" value={totalIncome} readOnly />
            </div>

            <button className="add-category-btn">
              <img src={addIcon} alt="Add" className="add-icon" /> Add Income
            </button>
          </section>

          {/* Expenses Section */}
          <section className="expense-section">
            <img src={penIcon} alt="Edit" onClick={toggleEditMode} className="edit-icon" />
            <img src={saveIcon} alt="Save" className="save-icon" onClick={handleSave} />
            <h2>Expenses</h2>
            {expenseItems.map((item) => (
              <div key={item.id} className="expense-item">
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => handleInputChange(item.id, parseFloat(e.target.value), 'expense')}
                  readOnly={!isEditMode} // Editable only in edit mode
                  min="0" // Prevent negative values
                />
                <span>{item.category}</span>
                {isEditMode && (
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    className="delete-icon"
                    onClick={() => handleDeleteItem(item.id, 'expense')}
                  />
                )}
              </div>
            ))}

            {/* Total Expense Field */}
            <div className="total-field">
              <label>Total Expenses</label>
              <input type="number" value={totalExpenses} readOnly />
            </div>

            <button className="add-category-btn">
              <img src={addIcon} alt="Add" className="add-icon" /> Add Expense
            </button>
          </section>
        </div>
      </div>
    );
  };

export default HomePage;
