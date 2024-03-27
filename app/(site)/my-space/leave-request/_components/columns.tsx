"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { Department } from "@/types/profile";
import DateTimeCell from "@/components/common/date-time-cell";
import { LeaveRequest } from "@/types/leave";
import StatusCell from "@/components/common/status-cell";


export const columns: ColumnDef<LeaveRequest>[] = [
  {
    header: "Leave Type",
    accessorKey: "leaveType.name",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusCell status={row.getValue("status")} />
  },
  {
    header: "Reason",
    accessorKey: "reason",
  },
  {
    header: "Start Date",
    accessorKey: "startDate",
  },
  {
    header: "End Date",
    accessorKey: "endDate",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <DateTimeCell dateStr={row.getValue("createdAt")} isTime={0} />
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
