"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action" 
import DateTimeCell from "@/components/common/date-time-cell"; 
import { Reports } from "@/types/reports";


export const columns: ColumnDef<Reports>[] = [
  {
    header: "Report Name",
    accessorKey: "name",
  }, 
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
