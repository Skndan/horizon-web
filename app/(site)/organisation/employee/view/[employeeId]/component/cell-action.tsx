"use client";

import { useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"; 
import { AlertModal } from "@/components/modals/alert-modal";
import { Department, FileInfo } from "@/types/profile";
import apiClient from "@/lib/api/api-client";
import { useUpdateStore } from "@/store/use-update-store";

interface CellActionProps {
  data: FileInfo;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); 
  const { set } = useUpdateStore();

  const onConfirm = async () => {
    try {
      setLoading(true);
      await apiClient.delete(`/file/${data.id}`);
      set(data?.id ?? '');
      toast.success('File deleted.');
      router.refresh();
    } catch (error) {
      toast.error('Please try again later');
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
      <Button className="text-red-500" variant={"outline"} size={"icon"} onClick={() => setOpen(true)}>
        <Trash className="h-4 w-4" />
      </Button>
    </>
  );
};
