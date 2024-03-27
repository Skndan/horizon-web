"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { Shift } from "@/types/attendance";
import DateTimeCell from "@/components/common/date-time-cell";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


export const columns: ColumnDef<Shift>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Work days",
    accessorKey: "workDays",
    cell: ({ row }) => <>
      <ToggleGroup type="multiple" className="justify-start p-0" size={"sm"} variant="outline" value={row.getValue("workDays")}>
        <ToggleGroupItem value="SUN">SUN</ToggleGroupItem>
        <ToggleGroupItem value="MON">MON</ToggleGroupItem>
        <ToggleGroupItem value="TUE">TUE</ToggleGroupItem>
        <ToggleGroupItem value="WED">WED</ToggleGroupItem>
        <ToggleGroupItem value="THU">THU</ToggleGroupItem>
        <ToggleGroupItem value="FRI">FRI</ToggleGroupItem>
        <ToggleGroupItem value="SAT">SAT</ToggleGroupItem>
      </ToggleGroup>
    </>
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => <DateTimeCell dateStr={row.getValue("createdAt")} isTime={2} />

  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
