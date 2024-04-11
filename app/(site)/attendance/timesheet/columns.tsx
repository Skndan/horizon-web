"use client"

import { ColumnDef } from "@tanstack/react-table"

import DateTimeCell from "@/components/common/date-time-cell";
import { LeaveRequest } from "@/types/leave";
import StatusCell from "@/components/common/status-cell";
import { Daylog, Timesheet } from "@/types/attendance";
import ShiftCell from "@/components/common/shift-cell";
import { CellAction } from "./cell-action";
import { Clock, MoveHorizontal } from "lucide-react";
import { convertTime } from "@/lib/utils/string-utils";
import { Label } from "recharts";
import AvatarCell from "@/components/common/avatar-cell";


export const columns: ColumnDef<Timesheet>[] = [
    {
        header: "Name",
        accessorKey: "profile",
        cell: ({ row }) => {
            // Access nested data directly from the row's original data
            const timesheet = row.original;
            return <AvatarCell
                avatarUrl={""}
                employeeName={timesheet.profile.name}
                employeeId={timesheet.profile.employeeId} // Assuming you have a strategy for the ID
            />
        }
    },
    {
        header: "Time Range",
        cell: ({ row }) => {
            const fromDate = row.original.fromDate;
            const toDate = row.original.toDate;
            return <>
                <div className="flex flex-row items-center gap-2">
                    <DateTimeCell dateStr={fromDate} isTime={0} />
                    <MoveHorizontal className="h-4 w-4" />
                    <DateTimeCell dateStr={toDate} isTime={0} />
                </div>
            </>
        }
    },
    {
        header: "Total Work Hours",
        cell: ({ row }) => {
            const totalWork = row.original.totalWork;
            const workHours = row.original.workHours;
            return <div className="flex flex-row items-center gap-1">
                <Clock className="h-4 w-4" />
                <p>{totalWork} hrs</p>
                <p>out of {workHours} hrs</p>
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
        header: "Total Days",
        cell: ({ row }) => {
            const totalDays = row.original.totalDays;
            const loggedDays = row.original.loggedDays;
            return <div className="flex flex-row items-center gap-1">
                <p>{loggedDays}</p>
                <p>out of {totalDays}</p>
            </div>
        }
    },
    // {
    //     header: "LOP",  
    //     accessorKey: "lop",
    // },
    // {
    //     header: "Holidays",  
    //     accessorKey: "holidays",
    // },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => <StatusCell status={row.getValue("status")} />
    },
    {
        header: "Remarks",
        accessorKey: "remarks"
    },
    {
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ row }) => {
            return <>
                <div className="flex flex-row items-center gap-2">
                    <DateTimeCell dateStr={row.getValue("createdAt")} isTime={0} />
                </div>
            </>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {

            const rr = row.original;

            return (rr.status === "INITIATED") ?
                <CellAction data={row.original} /> : <></>;
        }
    },
];
