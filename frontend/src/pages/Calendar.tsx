import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import addIcon from "../assets/add.svg";
import deleteIcon from "../assets/delete.svg";
import "./Calendar.css";

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<{ [key: string]: string[] }>({
    "2024-10-10": ["Phone Bill"],
    "2024-10-21": ["Brunch", "Utility Bill"],
  });

  // State to handle selected expense from localStorage
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  useEffect(() => {
    // Retrieve the selected expense from localStorage
    const expense = localStorage.getItem("selectedExpense");
    if (expense) {
      setSelectedExpense(JSON.parse(expense));
    }
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  // Handle adding an event or an expense to the selected date
  const handleAddEvent = (date: string) => {
    if (selectedExpense) {
      // Add the selected expense from localStorage
      const event = `${selectedExpense.category} - $${selectedExpense.amount}`;
      setEvents((prevEvents) => ({
        ...prevEvents,
        [date]: [...(prevEvents[date] || []), event],
      }));

      // Clear the selected expense after adding it
      localStorage.removeItem("selectedExpense");
      setSelectedExpense(null);
    } else {
      // Prompt user to add a custom event
      const newEvent = prompt("Enter event name:");
      if (newEvent) {
        setEvents((prevEvents) => ({
          ...prevEvents,
          [date]: [...(prevEvents[date] || []), newEvent],
        }));
      }
    }
  };

  const handleDeleteEvent = (date: string, index: number) => {
    setEvents((prevEvents) => {
      const updatedEvents = [...(prevEvents[date] || [])];
      updatedEvents.splice(index, 1);
      return {
        ...prevEvents,
        [date]: updatedEvents,
      };
    });
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
  };

  return (
    <div className="calendar-container">
      <Calendar
        onClickDay={handleDateClick}
        value={selectedDate}
        tileClassName={({ date, view }) => {
          const eventCount = (events[formatDateKey(date)] || []).length;
          return view === "month" && eventCount > 0 ? "event-day" : null;
        }}
      />

      {selectedDate && (
        <div className="event-details">
          <h3>{selectedDate.toDateString()}</h3>
          <div className="events">
            {(events[formatDateKey(selectedDate)] || []).map((event, index) => (
              <div key={index} className="event-item">
                <img
                  src={deleteIcon}
                  alt="Delete Event"
                  className="event-delete-icon"
                  onClick={() =>
                    handleDeleteEvent(formatDateKey(selectedDate), index)
                  }
                />
                <span>{event}</span>
              </div>
            ))}
          </div>
          {/* Add event or expense to the selected date */}
          <button
            className="add-event-btn"
            onClick={() => handleAddEvent(formatDateKey(selectedDate))}
          >
            <img src={addIcon} alt="Add Event" className="add-icon" /> Add Event
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
