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
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modals/alert-modal";
import { Department } from "@/types/profile";
import apiClient from "@/lib/api/api-client";
import { useUpdateStore } from "@/store/use-update-store";

interface CellActionProps {
  data: Department;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const { set } = useUpdateStore();

  const onConfirm = async () => {
    try {
      setLoading(true);
      await apiClient.delete(`/department/${data.id}`);
      set(data?.id ?? '');
      toast.success('Department deleted.');
      router.refresh();
    } catch (error) {
      toast.error('Make sure you re-assign all employees using this department first.');
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      /> 
      <Button className="text-red-500" variant={"outline"} size={"icon"}>
        <Trash className="h-4 w-4" />
      </Button> 
    </>
  );
};
