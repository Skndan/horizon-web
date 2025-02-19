"use client"

import { ColumnDef } from "@tanstack/react-table"

import AvatarCell from "@/components/common/avatar-cell";
import { Daylog } from "@/types/attendance";
import DateTimeCell from "@/components/common/date-time-cell";
import ShiftCell from "@/components/common/shift-cell";

export const columns: ColumnDef<Daylog>[] = [
  {
    header: "Name",
    accessorKey: "profile",
    cell: ({ row }) => {
      // Access nested data directly from the row's original data
      const profile = row.original.profile;
      return <AvatarCell
        avatarUrl={""}
        employeeId={profile.id}
        employeeName={profile.name}
        employeeCode={profile.employeeId} // Assuming you have a strategy for the ID
      />
    }
  },
  {
    header: "First In",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const status = row.original.status;
      return <>
        <div className="flex flex-row items-center gap-2">
          <DateTimeCell dateStr={row.getValue("createdAt")} isTime={1} />
          {status == "IN" ? <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
          </span> : <></>} 
        </div>
      </>
    }
  },
  {
    header: "Last Out",
    accessorKey: "updatedAt",
    cell: ({ row }) => { 
      const status = row.original.status; 
      return <>
        <div className="flex flex-row items-center gap-2">
          <DateTimeCell dateStr={row.getValue("updatedAt")} isTime={1} />
          {status == "OUT" ? <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-400"></span>
          </span> : <></>} 
        </div>
      </>
    }
  },
  {
    header: "Total Work Hours",
    accessorKey: "totalWork",
    cell: ({ row }) => {  
      return <p>{row.getValue("totalWork")} hrs</p>
    }
  },
  {
    header: "Total Break Hours",
    accessorKey: "totalBreak",
    cell: ({ row }) => {  
      return <p>{row.getValue("totalBreak")} hrs</p>
    }
  },
  {
    header: "Shift",
    accessorKey: "shift",
    cell: ({ row }) => {
      // Access nested data directly from the row's original data
      const shift = row.original.profile.shift;
      return shift && <ShiftCell shiftName={shift.name} shiftWorkDays={shift.workDays} shiftStartDate={shift.startTime} shiftEndDate={shift.endTime} />
    }
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <CellAction data={row.original} />
  // },
];
