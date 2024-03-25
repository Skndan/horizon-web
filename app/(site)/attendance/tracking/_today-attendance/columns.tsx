"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import DateTimeCell from "@/components/common/date-time-cell";
import { Attendance } from "../data";
import AvatarCell from "@/components/common/avatar-cell";


export const columns: ColumnDef<Attendance>[] = [
  { 
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <AvatarCell avatarUrl={row.getValue("avatar")} employeeName={row.getValue("name")} employeeId={"HZ-1"} />
  }, 
  {
    accessorKey: "firstIn",
    header: "First In",
  },
  {
    accessorKey: "lastOut",
    header: "Last Out",
  }, 
  {
    accessorKey: "total",
    header: "Total",
  }, 
  {
    accessorKey: "shift",
    header: "Shift",
  },  
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
