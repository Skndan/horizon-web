"use client";

import { useState } from "react";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modals/alert-modal";
import apiClient from "@/lib/api/api-client";
import { DesignationForm } from "../designation-form";
import { useUpdateStore } from "@/store/use-update-store";
import { Designation } from "@/types/profile";

interface CellActionProps {
  data: Designation;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
}) => {

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await apiClient.delete(`/designation/${data.id}`);
      toast.success('Designation deleted.');
      set(`delete-designation-${data.id}`);
    } catch (error) {
      toast.error('Make sure you re-assign all employees using this location first.' + error);
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const [openForm, setOpenForm] = useState(false);
  const { set } = useUpdateStore();

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

      <DesignationForm 
        isOpen={openForm}
        onClose={() => {
          setOpenForm(false);
          set(data?.id ?? '');
        }}
        initialData={data}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end"> 
          <DropdownMenuItem
            onClick={() => setOpenForm(true)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpen(true)} className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
