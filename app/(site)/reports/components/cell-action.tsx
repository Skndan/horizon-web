"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Reports } from "@/types/reports";

interface CellActionProps {
  data: Reports;
  onAction: (data: Reports) => void; // The function prop
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
  onAction
}) => {

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Download</span>
            <Download className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Download</DropdownMenuLabel>
          <DropdownMenuItem disabled>
            <FileText className="mr-2 h-4 w-4" /> PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction(data)}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
