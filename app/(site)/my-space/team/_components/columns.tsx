"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Profile } from "@/types/profile";
import DateTimeCell from "@/components/common/date-time-cell";
import ShiftCell from "@/components/common/shift-cell";
import AvatarCell from "@/components/common/avatar-cell";

export const columns: ColumnDef<Profile>[] = [
  {
    header: "Name",
    accessorKey: "profile",
    cell: ({ row }) => {
      // Access nested data directly from the row's original data
      const profile = row.original;
      return <AvatarCell
        avatarUrl={""}
        employeeId={profile.id}
        employeeName={profile.name}
        employeeCode={profile.employeeId} // Assuming you have a strategy for the ID
      />
    }
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
    accessorKey: "shift",
    header: "Shift Workdays",
    cell: ({ row }) => {
      // Access nested data directly from the row's original data
      const shift = row.original.shift;
      return shift && <ShiftCell shiftName={shift.name} shiftWorkDays={shift.workDays} shiftStartDate={shift.startTime} shiftEndDate={shift.endTime} />
    }
  },
  {
    accessorKey: "dateOfJoining",
    header: "Joined",
    cell: ({ row }) => <DateTimeCell dateStr={row.getValue("dateOfJoining")} isTime={0} />

  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <CellAction data={row.original} />
  // },
];
