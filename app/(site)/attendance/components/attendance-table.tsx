"use client";

import { useState } from 'react';
import { format, getDaysInMonth, addDays } from 'date-fns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { isAfter, startOfDay } from 'date-fns'; // Add isAfter and startOfDay to the import
interface Employee {
  name: string;
  attendance: Record<string, number>; // Date in 'yyyy-MM-dd' format as key
}

const initialEmployees: Employee[] = [
  { name: 'John Doe', attendance: { '2024-03-19': 1, '2024-03-20': 2, '2024-03-21': 1 } },
  { name: 'Jane Smith', attendance: { '2024-03-19': 1, '2024-03-20': 1, '2024-03-21': 0 } },
  { name: 'Emily Johnson', attendance: { '2024-03-19': 0, '2024-03-20': 0, '2024-03-21': 1 } },
  { name: 'Michael Brown', attendance: { '2024-03-19': 1, '2024-03-20': 1, '2024-03-21': 1 } },
  { name: 'Jessica Davis', attendance: { '2024-03-19': 2, '2024-03-20': 1, '2024-03-21': 0 } },
  { name: 'Daniel Miller', attendance: { '2024-03-19': 1, '2024-03-20': 2, '2024-03-21': 0 } },
  { name: 'Jennifer Wilson', attendance: { '2024-03-19': 1, '2024-03-20': 1, '2024-03-21': 0 } }
];

export default function AttendanceTable() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const daysInMonth = getDaysInMonth(selectedMonth);
  const monthYear = format(selectedMonth, 'yyyy-MM');

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, month] = event.target.value.split('-').map(Number);
    setSelectedMonth(new Date(year, month - 1, 1));
  };

  return (
    <div>
      <div className='flex justify-end'>
        <select value={format(selectedMonth, 'yyyy-MM')} className='w-[180px] flex h-10 items-center justify-end rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1' onChange={handleMonthChange}>
          {Array.from({ length: 12 }).map((_, index) => (
            <option key={index} value={`${format(selectedMonth, 'yyyy')}-${String(index + 1).padStart(2, '0')}`}>
              {format(new Date(format(selectedMonth, 'yyyy'), index), 'MMMM yyyy')}
            </option>
          ))}
        </select>
      </div>

      {/* <Select value={format(selectedMonth, 'yyyy-MM')} >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Array.from({ length: 12 }).map((_, index) => (
              <SelectItem key={index} value={`${format(selectedMonth, 'yyyy')}-${String(index + 1).padStart(2, '0')}`}>
                {format(new Date(format(selectedMonth, 'yyyy'), index), 'MMMM yyyy')}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select> */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            {[...Array(daysInMonth)].map((_, index) => (
              <TableHead key={index}>{format(addDays(new Date(monthYear), index), 'dd')}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>

          {employees.map(employee => (
            <TableRow key={employee.name}>
              <TableCell>{employee.name}</TableCell>
              {[...Array(daysInMonth)].map((_, index) => {
                const dateKey = format(addDays(new Date(monthYear), index), 'yyyy-MM-dd');
                console.log(dateKey);
                const currentDate = addDays(new Date(monthYear), index);
                const isFutureDate = isAfter(startOfDay(currentDate), startOfDay(new Date())); // Check if the date is in the future 
                return <TableCell key={index}>
                  {
                    isFutureDate ? '⚪' : employee.attendance[dateKey] == 1 ? '🟢' : employee.attendance[dateKey] == 2 ? '🟡' : '🔴'
                  }


                </TableCell>;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
