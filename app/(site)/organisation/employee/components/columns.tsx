"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action" 
import { Profile } from "@/types/profile";


export const columns: ColumnDef<Profile>[] = [
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
  }, 
  {
    accessorKey: "email",
    header: "Email",
  }, 
  { 
    accessorKey: "createdAt",
    header: "Joined",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
