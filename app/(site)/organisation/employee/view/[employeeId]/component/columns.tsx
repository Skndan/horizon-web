"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { FileInfo } from "@/types/profile";
import DateTimeCell from "@/components/common/date-time-cell";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import DownloadFileButton from "./download-cell";


export const columns: ColumnDef<FileInfo>[] = [
  {
    accessorKey: "fileName",
    header: "Name",
    cell: ({ row }) => {
      const fileName = row.original.fileName;
      const fileUrl = row.original.fileUrl;
      return <DownloadFileButton fileName={fileName!} filePath={fileUrl!} />;
    }
  },
  {
    accessorKey: "createdAt",
    header: "Uploaded At",
    cell: ({ row }) => <DateTimeCell dateStr={row.getValue("createdAt")} isTime={2} />
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
