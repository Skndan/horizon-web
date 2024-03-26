"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action" 


export const columns: ColumnDef<Location>[] = [
  {
    accessorKey: "label",
    header: "Name",
  },
  {
    accessorKey: "addressLine1",
    header: "Address Line 1",
  },
  
  {
    accessorKey: "addressLine2",
    header: "Address Line 2",
  },
  // {
  //   accessorKey: "country",
  //   header: "Country",
  // },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "pincode",
    header: "Pincode",
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
