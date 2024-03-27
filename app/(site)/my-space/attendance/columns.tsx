"use client"

import { ColumnDef } from "@tanstack/react-table"

import DateTimeCell from "@/components/common/date-time-cell";
import { LeaveRequest } from "@/types/leave";
import StatusCell from "@/components/common/status-cell";
import { Daylog } from "@/types/attendance";
import ShiftCell from "@/components/common/shift-cell";


export const columns: ColumnDef<Daylog>[] = [
    {
        header: "Date",
        accessorKey: "createdAt",
        cell: ({ row }) => {
            const status = row.original.status;
            return <>
                <div className="flex flex-row items-center gap-2">
                    <DateTimeCell dateStr={row.getValue("createdAt")} isTime={0} /> 
                </div>
            </>
        }
    },
    {
        header: "First In",
        accessorKey: "createdAt",
        cell: ({ row }) => {
            const status = row.original.status;
            return <>
                <div className="flex flex-row items-center gap-2">
                    <DateTimeCell dateStr={row.getValue("createdAt")} isTime={1} />
                    {status == "IN" ? <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                    </span> : <></>}
                </div>
            </>
        }
    },
    {
        header: "Last Out",
        accessorKey: "updatedAt",
        cell: ({ row }) => {
            const status = row.original.status;
            return <>
                <div className="flex flex-row items-center gap-2">
                    <DateTimeCell dateStr={row.getValue("updatedAt")} isTime={1} />
                    {status == "OUT" ? <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-400"></span>
                    </span> : <></>}
                </div>
            </>
        }
    },
    {
        header: "Total Work Hours",
        accessorKey: "totalWork",
        cell: ({ row }) => {
            return <p>{row.getValue("totalWork")} hrs</p>
        }
    },
    {
        header: "Total Break Hours",
        accessorKey: "totalBreak",
        cell: ({ row }) => {
            return <p>{row.getValue("totalBreak")} hrs</p>
        }
    },
    {
        header: "Shift",
        accessorKey: "shift",
        cell: ({ row }) => {
            // Access nested data directly from the row's original data
            const shift = row.original.profile.shift;
            return shift && <ShiftCell shiftName={shift.name} shiftWorkDays={shift.workDays} shiftStartDate={shift.startTime} shiftEndDate={shift.endTime} />
        }
    }
];
