"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { Profile } from "@/types/profile";
import DateTimeCell from "@/components/common/date-time-cell";
import ShiftCell from "@/components/common/shift-cell";
import AvatarCell from "@/components/common/avatar-cell";
import StatusCell from "@/components/common/status-cell";


export const columns: ColumnDef<Profile>[] = [
  {
    header: "Name",
    accessorKey: "name",
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
    accessorKey: "department.name",
    header: "Department",
    // cell: ({ row }) => {  
    //   const dept = row.original.department;
    //   return <p>{dept && row.getValue("department.name")}</p>
    // }
  },
  {
    accessorKey: "employeeStatus",
    header: "Status",
    cell: ({ row }) => <StatusCell status={row.getValue("employeeStatus") ?? ""} />
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
    accessorKey: "address.label",
    header: "Office",
    // cell: ({ row }) => {  
    //   return <p>{row.getValue("address.label") ?? ''}</p>
    // }
  },
  {
    header: "Reporting Manager",
    accessorKey: "reportingManager.name",
    cell: ({ row }) => {
      // Access nested data directly from the row's original data
      const profile = row.original;
      if (profile) {
        return <AvatarCell
          avatarUrl={""}
          employeeId={profile.id}
          employeeName={profile.name}
          employeeCode={profile.employeeId} // Assuming you have a strategy for the ID
        />
      }

    }
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date Of Birth",
    cell: ({ row }) => <DateTimeCell dateStr={row.getValue("dateOfBirth")} isTime={0} />
  },
  {
    accessorKey: "dateOfJoining",
    header: "Joined",
    cell: ({ row }) => <DateTimeCell dateStr={row.getValue("dateOfJoining")} isTime={0} />
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <DateTimeCell dateStr={row.getValue("createdAt")} isTime={0} />
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
