"use client";

import apiClient from "@/lib/api/api-client";
import { Daylog, MonthlyDaylog } from "@/types/attendance";
import { addDays, format, formatDate, getDaysInMonth } from "date-fns";
import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
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
import { Label } from '@/components/ui/label';
import AvatarCell from '@/components/common/avatar-cell';
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { Holiday } from "@/types/holiday";
import { isWeekend } from "@/lib/utils/time-utils";

export const MonthlyAttendancePage = () => {

    const [data, setData] = useState<MonthlyDaylog[]>([])
    const [holiday, setHoliday] = useState<String[]>([])


    const [isLoading, setLoading] = useState(true)

    const orgId = localStorage.getItem("orgId");

    const [selectedMonth, setSelectedMonth] = useState(new Date());


    useEffect(() => {
        apiClient.get(`/time-sheet/day-log-by-organisation/month-wise/${orgId}/${formatDate(selectedMonth!.toISOString(), "yyyy-MM-dd")}`).then((res) => res.data)
            .then((data) => {
                setData(data)
                setLoading(false)
            });
    }, [selectedMonth])

    useEffect(() => {
        apiClient.get(`/holiday/${orgId}/${formatDate(selectedMonth!.toISOString(), "yyyy")}`).then((res) => res.data)
            .then((data) => {
                const holidayDates = data.filter((holiday: Holiday) => holiday.active).map((holiday: Holiday) => format(holiday.holiday, 'yyyy-MM-dd'));
                setHoliday(holidayDates)
                setLoading(false)
            });
    }, [])


    const daysInMonth = getDaysInMonth(selectedMonth);
    const monthYear = format(selectedMonth, 'yyyy-MM');

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const [year, month] = event.target.value.split('-').map(Number);
        setSelectedMonth(new Date(year, month - 1, 1));
    };


    return (
        <div className="flex-col">
            <div className="flex-1">
                {isLoading ?
                    (
                        <div className="grid h-screen place-items-center">
                            <Loader className="animate-spin h-5 w-5 mr-3" />
                        </div>
                    )
                    : (<>
                        <div className='flex flex-row  justify-center pb-4'>
                            <select value={format(selectedMonth, 'yyyy-MM')} className='w-[180px] flex h-10 items-center justify-end rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1' onChange={handleMonthChange}>
                                {Array.from({ length: 12 }).map((_, index) => (
                                    <option key={index} value={`${format(selectedMonth, 'yyyy')}-${String(index + 1).padStart(2, '0')}`}>
                                        {format(new Date(format(selectedMonth, 'yyyy'), index), 'MMMM yyyy')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {data.length == 0 ?
                            <EmptyStateTable
                                title={"No logs recorded"}
                                description={"You can see who are logged"}
                                action={null}
                                onClick={() => { }}
                            /> :
                            <div className="rounded-md border overflow-auto">
                                <Table className=" w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className='min-w-56 left-0 sticky bg-background'>Employee</TableHead>
                                            {[...Array(daysInMonth)].map((_, index) => (
                                                <TableHead key={index}>{format(addDays(new Date(monthYear), index), 'dd')}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            data.map(dayLog => (
                                                <TableRow key={dayLog.profile.id}>
                                                    <TableCell className='sticky min-w-56 left-0 bg-background'><AvatarCell avatarUrl={''} employeeName={dayLog.profile.name} employeeId={dayLog.profile.employeeId} /></TableCell>
                                                    {[...Array(daysInMonth)].map((_, index) => {
                                                        const dateKey = format(addDays(new Date(monthYear), index), 'yyyy-MM-dd');
                                                        const currentDate = addDays(new Date(monthYear), index);
                                                        const isFutureDate = isAfter(startOfDay(currentDate), startOfDay(new Date())); // Check if the date is in the future 

                                                        const isHoliday = holiday.includes(dateKey);
                                                        console.log(`${dateKey} ${isHoliday} ${dayLog.log.includes(dateKey)}`)

                                                        const icon = isFutureDate ? '⚪'
                                                            : dayLog.log.includes(dateKey) ? '🟢'
                                                                : isWeekend(dateKey) ? '🔵'
                                                                    : isHoliday ? '✨' // Change this icon to whatever you use for holidays
                                                                        : '🔴';
                                                        return <TableCell key={index}>
                                                            {icon}
                                                        </TableCell>;
                                                    })}
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                        }
                    </>)}
            </div>
        </div>)
}

export default MonthlyAttendancePage;