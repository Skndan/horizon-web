"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { Designation } from "@/types/profile"
import { toTitleCase } from "@/lib/utils/string-utils";


export const columns: ColumnDef<Designation>[] = [ 
  {
    header: "Level",
    accessorKey: "level",
    cell: ({ row }) => {
      const priority = row.original.level
      return (
        <div className="flex items-center">
          <span>{toTitleCase(priority)}</span>
        </div>
      )
    },
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const amount = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(date);

      return <div>{amount}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
