"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Task } from "@/types/task"
import { priorities, statuses } from "./data"
import { EmployeePayrollRun } from "@/types/payroll"
import AvatarCell from "@/components/common/avatar-cell"
import { Label } from "@/components/ui/label"
// import { Task } from "../_data/schema"

export const columns: ColumnDef<EmployeePayrollRun>[] = [
  {
    accessorKey: "profile.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee" />
    ),
    cell: ({ row }) => {
      const data = row.original;

      return <AvatarCell
        avatarUrl={""}
        employeeId={data.profile.id}
        employeeName={data.profile.name}
        employeeCode={data.profile.employeeId} // Assuming you have a strategy for the ID
      />
    },
  },
  {
    header: "Gross Pay",
    cell: ({ row }) => {
      const data = row.original;
      return <Label>{`₹${data.grossPay.toLocaleString("en-in")}`}</Label>
    }
  },
  {
    header: "Tax & Deductions",
    cell: ({ row }) => {
      const data = row.original;
      return <Label>{`₹${data.totalDeductions.toLocaleString("en-in")}`}</Label>
    }
  },
  {
    header: "Net Pay",
    cell: ({ row }) => {
      const data = row.original;
      return <>
        <Label className={data.netPay <= 0 ? 'text-red-600' : ''}>{`₹${data.netPay.toLocaleString("en-in")}`}</Label>
      </> 
    }
  },



  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]
