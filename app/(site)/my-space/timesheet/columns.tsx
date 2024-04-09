"use client"

import { ColumnDef } from "@tanstack/react-table"

import DateTimeCell from "@/components/common/date-time-cell";
import { LeaveRequest } from "@/types/leave";
import StatusCell from "@/components/common/status-cell";
import { Daylog } from "@/types/attendance";
import ShiftCell from "@/components/common/shift-cell";
import { CellAction } from "./cell-action";
import { Clock } from "lucide-react";
import { convertTime } from "@/lib/utils/string-utils";
import { Label } from "recharts";


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
        accessorKey: "createdAt1",
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
        accessorKey: "endTime",
        cell: ({ row }) => {
            const status = row.original.status;
            const endTime = row.original.endTime;
            return <>
                <div className="flex flex-row items-center gap-2">
                    {
                        row.getValue("endTime") != undefined ?
                            <p>{convertTime(endTime)}</p> : <></>
                    }
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
            return <div className="flex flex-row items-center gap-1">
                <Clock className="h-4 w-4" />
                <p>{row.getValue("totalWork")} hrs</p>
            </div>
        }
    },
    {
        header: "Total Break Hours",
        accessorKey: "totalBreak",
        cell: ({ row }) => {
            return <div className="flex flex-row items-center gap-1">
                <Clock className="h-4 w-4" />
                <p>{row.getValue("totalBreak")} hrs</p>
            </div>
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
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
];
