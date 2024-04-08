"use client";

import axios from "axios";
import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modals/alert-modal";
import { SalaryTemplate } from "@/types/payroll";
import { Modal } from "@/components/ui/modal";

interface CellActionProps {
  data: SalaryTemplate;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
}) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      router.push(`/payroll/settings/salary-templates/${data.id}`);
    } catch (error) {
      toast.error('Make sure you removed all categories using this billboard first.');
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Are you sure?"
        description="Editing the template won't affect current assignees; changes apply to future employees only"
        isOpen={open}
        onClose={onConfirm}
      >
        <div className="pt-4 space-x-2 flex items-center justify-end w-full">
          <Button disabled={loading} variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={loading} variant="destructive" onClick={onConfirm}>Continue</Button>
        </div>
      </Modal>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)} >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled onClick={() => setOpen(true)} >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
