"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./timesheet-cell-action"
import { Profile } from "@/types/profile";
import DateTimeCell from "@/components/common/date-time-cell";
import ShiftCell from "@/components/common/shift-cell";
import AvatarCell from "@/components/common/avatar-cell";
import { MissedTimesheet } from "@/types/payroll";


export const timesheetColumns: ColumnDef<MissedTimesheet>[] = [
  {
    header: "Name",
    accessorKey: "profile",
    cell: ({ row }) => {
      // Access nested data directly from the row's original data
      const ms = row.original;
      return <AvatarCell
        avatarUrl={""}
        employeeId={ms.profile.id}
        employeeName={ms.profile.name}
        employeeCode={ms.profile.employeeId} // Assuming you have a strategy for the ID
      />
    }
  }, 
  {
    accessorKey: "unclaimedDays",
    header: "Unclaimed Days",
  }, 
];
