"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action" 
import DateTimeCell from "@/components/common/date-time-cell"; 
import { LeaveType } from "@/types/leave";


export const columns: ColumnDef<LeaveType>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Balance",
    accessorKey: "count", 
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const amount = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(date);

      return <div>{amount}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
