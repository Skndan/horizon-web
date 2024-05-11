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
  },
  {
    value: "PERCENTAGE_OF_COMPONENT",
    label: "% of ",
  }
]

export const columns: ColumnDef<SalaryTemplateItem>[] = [
  {
    header: "Name",
    accessorKey: "componentName",
  },
  {
    header: "Earning Type",
    accessorKey: "componentType.name",
  },
  {
    header: "Calculation",
    accessorKey: "status",
    cell: ({ row }) => {
      const earning = row.original;

      const status = calculationType.find(
        (status) => status.value === earning.calculationType
      )

      if (earning.calculationType === "FIXED_AMOUNT") {
        return (
          <div className="flex w-[200px] items-center">
            <span>{status?.label} of ₹{earning.value.toLocaleString()}</span>
          </div>
        )
      }

      if(earning.calculationType === "PERCENTAGE_OF_COMPONENT"){
        return (
          <div className="flex w-[200px] items-center">
            <span>{earning.value}{status?.label}{earning.salaryComponent.componentName}</span>
          </div>
        )
      }

      return (
        <div className="flex w-[200px] items-center">
          <span>{earning.value}{status?.label}</span>
        </div>
      )
    },
  },

  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const earning = row.original;
      return (
        <div className="flex w-[100px] items-center">
          {
            earning.active ? <Label className="text-green-500">Active</Label> : <Label className="text-red-500">In Active</Label>
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
