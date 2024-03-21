"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import DateTimeCell from "@/components/common/date-time-cell";
import { Attendance } from "../data";
import AvatarCell from "@/components/common/avatar-cell";


export const columns: ColumnDef<Attendance>[] = [
  { 
    accessorKey: "avatar",
    header: "",
    cell: ({ row }) => <AvatarCell avatarUrl ={row.getValue("avatar")} />
  },
  {
    accessorKey: "name",
    header: "Name",
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
