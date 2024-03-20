"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action" 
import { Department } from "@/types/profile";
import DateTimeCell from "@/components/common/date-time-cell";


export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  }, 
  { 
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <DateTimeCell dateStr={row.getValue("createdAt")} /> 
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
