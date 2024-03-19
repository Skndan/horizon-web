"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action" 
import { Department } from "@/types/profile";


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
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
