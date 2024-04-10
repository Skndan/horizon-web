"use client"

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';

// Shift day allocation
const ShiftSchedule = () => {
  const days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weeks = ['1st Week', '2nd Week', '3rd Week', '4th Week', '5th Week'];

  // Submit handler
  const handleSubmit = (event) => {
    event.preventDefault();

    // Initialize an object to store the form data
    let formData = {};

    // Populate the formData with weeks as keys and empty arrays as values
    weeks.forEach((week, weekIndex) => {
      formData[`${weekIndex + 1}`] = []; // Adjusted for a 1-based index in the JSON keys
    });

    // Extract checkbox values and organize them into the formData object
    days.forEach((day, dayIndex) => {
      weeks.forEach((_, weekIndex) => {
        const checkBoxId = `checkbox-${dayIndex}-${weekIndex}`;
        if (event.target[checkBoxId].checked) {
          // Shorten day names for JSON output and add them to the respective week
          let shortDay = day.substring(0, 3).toUpperCase(); // Converts 'Monday' to 'mon', etc.
          formData[`${weekIndex + 1}`].push(shortDay);
        }
      });
    });

    // Convert formData to JSON format
    // console.log(JSON.stringify(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md border">
        <Table> 
          <TableHeader>
            <TableRow>
              <TableHead>Day / Week</TableHead>
              {weeks.map((week, index) => (
                <TableHead key={index}>{week}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {days.map((day, index) => ( 
              <TableRow key={index}>
                <TableCell>{day}</TableCell> 
                {weeks.map((_, weekIndex) => (
                  <TableCell key={weekIndex}>
                    <input
                      type="checkbox"
                      id={`checkbox-${index}-${weekIndex}`}
                      name={`checkbox-${index}-${weekIndex}`}
                    />
                  </TableCell>
                ))}
              </TableRow> 
            ))}
          </TableBody>
        </Table>
      </div>
      <Button type="submit">Submit Schedule</Button>
    </form>
  );
};

export default ShiftSchedule;
