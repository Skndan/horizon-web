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
import { DepartmentForm } from "../department-form";
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
      await apiClient.delete(`/department/${data.id}`).then((res) => {
        set(data?.id ?? '');
        toast.success('Department deleted.');
        router.refresh();
      }).catch((e) => {
        toast.error(e.response.data.error);
        return;
      }); 
    } catch (error) {
      console.log(error);
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

      <DepartmentForm
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
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setOpenForm(true)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-red-500"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
