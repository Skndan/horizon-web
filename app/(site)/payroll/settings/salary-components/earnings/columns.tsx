"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import AvatarCell from "@/components/common/avatar-cell";
import { AllowanceDetail } from "../../../data";


export const columns: ColumnDef<AllowanceDetail>[] = [ 
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "basis",
    header: "Basis",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <CellAction data={row.original} />
  // },
];
