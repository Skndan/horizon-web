"use client"

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import DateTimeCell from "@/components/common/date-time-cell";
import StatusCell from "@/components/common/status-cell";
import { Interview } from "@/types/hiring";
import AvatarCell from "@/components/common/avatar-cell";


export const columns: ColumnDef<Interview>[] = [ 
  {
    header: "Candidate",
    accessorKey: "name",
    cell: ({ row }) => {
      // Access nested data directly from the row's original data
      const profile = row.original;
      return <AvatarCell
        avatarUrl={""}
        employeeId={profile.id}
        employeeName={profile.candidate.name}
        employeeCode={profile.candidate.applicationNumber.toString()} // Assuming you have a strategy for the ID
      />
    }
  },
  {
    header: "CTC (in lakhs.)",
    accessorKey: "ctc"
  }, 
  {
    header: "Min. Experience",
    accessorKey: "minExperience"
  }, 
  {
    header: "Job Code",
    accessorKey: "code"
  },  
  // {
  //   header: "Reporting To",
  //   accessorKey: "profile.reportingManger.name",
  //   cell: ({ row }) => {
  //     // Access nested data directly from the row's original data
  //     const reportingManager = row.original.profile.reportingManager;
  //     return reportingManager ? <AvatarCell
  //       avatarUrl={""}
  //       employeeId={reportingManager?.id ?? ''}
  //       employeeName={reportingManager?.name ?? ''}
  //       employeeCode={reportingManager?.employeeId ?? ''} // Assuming you have a strategy for the ID
  //     /> : <></>
  //   }
  // },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusCell status={row.getValue("status")} />
  },
  // {
  //   header: "Start Date",
  //   accessorKey: "startDate",
  // },
  // {
  //   header: "End Date",
  //   accessorKey: "endDate",
  // },
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
