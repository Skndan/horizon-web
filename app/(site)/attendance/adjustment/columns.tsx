"use client"

import { ColumnDef } from "@tanstack/react-table"; 
import { CellAction } from "./cell-action";
import AvatarCell from "@/components/common/avatar-cell";
import { Attendance } from "@/types/attendance";
import StatusCell from "@/components/common/status-cell";


export const columns: ColumnDef<Attendance>[] = [
  {
    header: "Employee",
    accessorKey: "profile.name",
    cell: ({ row }) => {
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
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusCell status={row.getValue("status")} />
},
  {
    header: "Date",
    accessorKey: "setDate",
  },
  {
    header: "Time",
    accessorKey: "setTime",
  }, 
  {
    header: "Reason",
    accessorKey: "reason",
  },
  {
    header: "Remarks",
    accessorKey: "remarks",
  }, 
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
