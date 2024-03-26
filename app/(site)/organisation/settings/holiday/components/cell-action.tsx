"use client";

import { useState } from "react";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
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
import { useDepartmentSheet } from "@/store/sheet/use-department-sheet";
import apiClient from "@/lib/api/api-client";
import { revalidatePath } from "next/cache";
import { useDeleteStore } from "@/store/use-delete-store";
import { HolidayForm } from "../holiday-form";
import { useUpdateStore } from "@/store/use-update-store";
import { Holiday } from "@/types/holiday";

interface CellActionProps {
  data: Holiday;
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
      await apiClient.delete(`/holiday/${data.id}`);
      toast.success('Holiday deleted.');
      set(`delete-holiday-${data.id}`);
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

      <HolidayForm 
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
