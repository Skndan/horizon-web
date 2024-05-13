"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Profile } from "@/types/profile";
import DateTimeCell from "@/components/common/date-time-cell";
import ShiftCell from "@/components/common/shift-cell";
import AvatarCell from "@/components/common/avatar-cell";
import { Daylog } from "@/types/attendance";
import { Label } from "@/components/ui/label";


export const activeColumns: ColumnDef<Daylog>[] = [
  {
    header: "Name",
    accessorKey: "profile",
    cell: ({ row }) => {
      const profile = row.original;
      return <AvatarCell
        avatarUrl={""}
        employeeId={profile.profile.id}
        employeeName={profile.profile.name}
        employeeCode={profile.profile.employeeId}
      />
    }
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    cell: ({ row }) => {
      const profile = row.original;
      return <Label>{profile.profile.mobile}</Label>
    }
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const profile = row.original;
      return <Label>{profile.profile.email}</Label>
    }
  },
  {
    accessorKey: "endTime",
    header: "Last Login time",
    cell: ({ row }) => {
      const profile = row.original;
      return profile.endTime && <DateTimeCell dateStr={profile.endTime} isTime={3} />
    }
  },
  // {
  //   accessorKey: "shift",
  //   header: "Shift Workdays",
  //   cell: ({ row }) => {
  //     // Access nested data directly from the row's original data
  //     const shift = row.original.shift;
  //     return shift && <ShiftCell shiftName={shift.name} shiftWorkDays={shift.workDays} shiftStartDate={shift.startTime} shiftEndDate={shift.endTime} />
  //   }
  // },
  // {
  //   accessorKey: "dateOfJoining",
  //   header: "Joined",
  //   cell: ({ row }) => <DateTimeCell dateStr={row.getValue("dateOfJoining")} isTime={0} /> 
  // }, 
];
