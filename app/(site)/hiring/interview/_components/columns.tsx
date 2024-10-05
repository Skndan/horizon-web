"use client"

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import DateTimeCell from "@/components/common/date-time-cell";
import StatusCell from "@/components/common/status-cell";
import { Interview } from "@/types/hiring";
import AvatarCell from "@/components/common/avatar-cell";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft } from "lucide-react";


export const columns: ColumnDef<Interview>[] = [ 
  {
    header: "Candidate",
    accessorKey: "name",
    cell: ({ row }) => {
      // Access nested data directly from the row's original data
      const profile = row.original;
      return <AvatarCell
        avatarUrl={""}
        type={"candidate"}
        employeeId={profile.candidate.applicationNumber.toString()}
        employeeName={profile.candidate.name}
        employeeCode={`#${profile.candidate.applicationNumber.toString()}`} // Assuming you have a strategy for the ID
      />
    }
  },
  {
    header: "Position",
    accessorKey: "candidate.position.title"
  },
  {
    header: "Last Transition",
    accessorKey: "latestTransition.transitionName"
  },   
    {
      accessorKey: "interviewDate",
      header: "Interview Date",
      cell: ({ row }) => <DateTimeCell dateStr={row.getValue("interviewDate")} isTime={0} />
    }, 
  {
    accessorKey: "startTime",
    header: "Slot",
    cell: ({ row }) => {
      const tariff = row.original;
      return <>
        <div className="flex flex-row items-center gap-2">
          <Label>{tariff.startTime}</Label>
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          <Label>{tariff.endTime}</Label>
        </div>
      </>
    }
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <DateTimeCell dateStr={row.getValue("createdAt")} isTime={2} />
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
