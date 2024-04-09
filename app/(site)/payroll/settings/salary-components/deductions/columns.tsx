"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { SalaryTemplateItem } from "@/types/payroll";
import { Label } from "@/components/ui/label";

const calculationType = [
  {
    value: "FIXED_AMOUNT",
    label: "Flat Amount",
  },
  {
    value: "PERCENTAGE_OF_CTC",
    label: "% of CTC",
  },
  {
    value: "PERCENTAGE_OF_BASIC",
    label: "% of Basic",
  }
]

export const columns: ColumnDef<SalaryTemplateItem>[] = [
  {
    header: "Name",
    accessorKey: "componentName",
  },
  {
    header: "Deduction Type",
    accessorKey: "componentType.name",
  },
  {
    header: "Calculation",
    accessorKey: "status",
    cell: ({ row }) => {
      const deduction = row.original;

      const status = calculationType.find(
        (status) => status.value === deduction.calculationType
      )

      if (deduction.calculationType === "FIXED_AMOUNT") {
        return (
          <div className="flex w-[100px] items-center">
            <span>{status?.label}</span>
          </div>
        )
      }

      return (
        <div className="flex w-[100px] items-center">
          <span>{deduction.value}{status?.label}</span>
        </div>
      )
    },
  },

  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const deduction = row.original;
      return (
        <div className="flex w-[100px] items-center">
          {
            deduction.active ? <Label className="text-green-500">Active</Label> : <Label className="text-red-500">In Active</Label>
          }
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
