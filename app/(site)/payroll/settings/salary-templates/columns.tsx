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
  {
    header: "CTC",
    accessorKey: "ctc", 
    cell: ({ row }) => {  
      const ctc = Number(row.getValue("ctc"));
      return <p>₹{ctc.toLocaleString("en-in", { minimumFractionDigits: 0 })}</p>
    }
  }, 
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
