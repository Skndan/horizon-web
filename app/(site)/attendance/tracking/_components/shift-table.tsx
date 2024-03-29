"use client";
import React, { useState } from 'react';

const ShiftTable = ({ employees , updateShift } : {employees: any, updateShift: any}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedShift, setSelectedShift] = useState(null);

  // Function to get the start and end date of the week
  const getWeekDays = (selectedDate: any) => {
    const weekStart = new Date(selectedDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Starting from Monday
    const days = Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + index);
      return day;
    });
    return days;
  };

  const weekDays = getWeekDays(selectedDate);

  const handleChangeShift = (employeeId: any, date: any, newShift: string) => {
    updateShift(employeeId, date, newShift);
    setSelectedShift(null); // Close the dialog after updating
  };

  // Navigate weeks
  const goPrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const goNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  return (
    <>
      <button onClick={goPrevWeek}>Previous Week</button>
      <button onClick={goNextWeek}>Next Week</button>

      <table>
        <thead>
          <tr>
            <th>Employee</th>
            {weekDays.map(day => (
              <th key={day.toISOString()}>{day.toLocaleDateString()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee: any) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              {weekDays.map(day => (
                <td key={day.toISOString()}>
                  {/*  onClick={() => setSelectedShift({ employee, day })} */}
                  {employee.shifts[day.toLocaleDateString()] || 'Off'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* {selectedShift && (
        <div className="dialog">
          <p>Edit Shift for {selectedShift.employee.name} on {selectedShift.day.toLocaleDateString()}</p>
          <button onClick={() => handleChangeShift(selectedShift.employee.id, selectedShift.day, 'Morning')}>Morning</button>
          <button onClick={() => handleChangeShift(selectedShift.employee.id, selectedShift.day, 'Evening')}>Evening</button>
          <button onClick={() => setSelectedShift(null)}>Cancel</button>
        </div>
      )} */}
    </>
  );
};

export default ShiftTable;