"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action" 
import { FileInfo } from "@/types/profile";
import DateTimeCell from "@/components/common/date-time-cell";


export const columns: ColumnDef<FileInfo>[] = [
  {
    header: "Name",
    accessorKey: "fileName",
    // convert this into file path, open when on click
  }, 
  { 
    accessorKey: "createdAt",
    header: "Uploaded At",
    cell: ({ row }) => <DateTimeCell dateStr={row.getValue("createdAt")} isTime={0} /> 
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
