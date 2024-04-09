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
import { ComponentType } from "@/types/payroll";
import { ComponentTypeForm } from "./component-type-form";
import { useUpdateStore } from "@/store/use-update-store";

interface CellActionProps {
  data: ComponentType;
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
      // setLoading(true);
      // await axios.delete(`/api/${params.storeId}/billboards/${data}`);
      // toast.success('Billboard deleted.'); 
    } catch (error) {
      toast.error('Make sure you removed all categories using this billboard first.');
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

      <ComponentTypeForm
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
            onClick={() => setOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
