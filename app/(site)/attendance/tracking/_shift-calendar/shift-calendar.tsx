"use client";

import ShiftTable from "../_components/shift-table";

// Sample data
const employees = [
    { id: 1, name: 'Alice', shifts: { '1': 'Morning', '2': 'Evening' } }, // and so on for each day
    // Add more employees as needed
];
const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1); // For simplicity, assuming 30 days

const ShiftCalendar = () => {
    const updateShift = (employeeId: any, day: any, newShift: any) => {
        // Logic to update the shift in your data source
        console.log(`Update ${employeeId}'s shift on day ${day} to ${newShift}`);
        // Update state or external data source accordingly
    };

    return (
        <div>
            <h1>Shift Schedule</h1>
            <ShiftTable employees={employees} updateShift={updateShift} />
        </div>
    );
};

export default ShiftCalendar;