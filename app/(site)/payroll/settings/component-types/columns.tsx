"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { ComponentType } from "@/types/payroll";
import { Label } from "@/components/ui/label";


export const columns: ColumnDef<ComponentType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div className="flex w-[100px] items-center">
          <Label className={type === "EARNING" ? 'text-green-500' : 'text-red-500'}>{type === "EARNING" ? 'Earning' : 'Deduction'}</Label>
        </div>
      ) 
    },
  },
  {
    header: "Is Fixed?",
    accessorKey: "fixed",
    cell: ({ row }) => {
      const fixed = row.original.fixed;
      return (
        <div className="flex w-[100px] items-center">
          <Label>{fixed ? 'Yes' : 'No'}</Label>
        </div>
      ) 
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
