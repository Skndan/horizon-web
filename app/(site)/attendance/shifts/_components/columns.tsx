"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action" 
import { Shift } from "@/types/attendance";
import DateTimeCell from "@/components/common/date-time-cell";


export const columns: ColumnDef<Shift>[] = [ 
  {
    accessorKey: "name",
    header: "Name",
  }, 
  { 
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => <DateTimeCell dateStr={row.getValue("createdAt")} />

  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
