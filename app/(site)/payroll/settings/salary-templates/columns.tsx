"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { SalaryTemplate } from "@/types/payroll";
import { Label } from "@/components/ui/label"; 

export const columns: ColumnDef<SalaryTemplate>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Description",
    accessorKey: "description",
  }, 
  // {
  //   id: "actions",
  //   cell: ({ row }) => <CellAction data={row.original} />
  // },
];
