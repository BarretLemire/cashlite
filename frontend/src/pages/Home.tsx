import React, { useContext, useState } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';
import './Home.css'; 

import penIcon from '../assets/pen.svg';
import deleteIcon from '../assets/delete.svg';
import saveIcon from '../assets/save.svg';
import addIcon from '../assets/add.svg';

const HomePage = () => {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext); // Get dark mode state
    const [isEditMode, setEditMode] = useState(false);
    const [incomeItems, setIncomeItems] = useState([
      { id: 1, amount: 750, category: "Disability" },
      { id: 2, amount: 2000, category: "Housing Allowance" },
    ]);
    const [expenseItems, setExpenseItems] = useState([
      { id: 1, amount: 240, category: "Gas" },
      { id: 2, amount: 118, category: "Phone" },
    ]);

    const totalIncome = incomeItems.reduce((total, item) => total + item.amount, 0);
    const totalExpenses = expenseItems.reduce((total, item) => total + item.amount, 0);

    const toggleEditMode = () => {
      setEditMode(!isEditMode);
    };

    const handleSave = () => {
      console.log('Save changes');
      setEditMode(false);
    };

    const handleDeleteItem = (id: number, type: 'income' | 'expense') => {
      if (type === 'income') {
        setIncomeItems(incomeItems.filter(item => item.id !== id));
      } else {
        setExpenseItems(expenseItems.filter(item => item.id !== id));
      }
    };

    const handleInputChange = (id: number, value: number, type: 'income' | 'expense') => {
      if (isNaN(value)) return;
      if (type === 'income') {
        setIncomeItems(incomeItems.map(item => (item.id === id ? { ...item, amount: value } : item)));
      } else {
        setExpenseItems(expenseItems.map(item => (item.id === id ? { ...item, amount: value } : item)));
      }
    };

    return (
      <div className={`home-container ${darkMode ? 'dark-mode' : ''}`}>
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
                  readOnly={!isEditMode}
                  min="0"
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
                  readOnly={!isEditMode}
                  min="0"
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
