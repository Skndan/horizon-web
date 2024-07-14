"use client";

import { Edit, MoreHorizontal } from "lucide-react"; 
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";  
import { Workflow } from "@/types/hiring";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


interface CellActionProps {
  data: Workflow;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
}) => {
  const router = useRouter(); 

  return (
    <>
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end"> 
          <DropdownMenuItem
            onClick={() => router.push(`/hiring/workflow/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator/>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
