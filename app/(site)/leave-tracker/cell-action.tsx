"use client";

import { useState } from "react";
import { MousePointerClick } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"; 
import apiClient from "@/lib/api/api-client";
import { useUpdateStore } from "@/store/use-update-store";
import { LeaveRequest } from "@/types/leave";
import { Modal } from "@/components/ui/modal";


interface CellActionProps {
  data: LeaveRequest;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { set } = useUpdateStore();

  const onConfirm = async (status: string) => {
    try {
      setLoading(true);
      data.status = status;
      await apiClient.put(`/leave-request/${data.id}`, data);
      toast.success('Leave request updated.');
      router.refresh();
      setOpen(false);
      set(`${Math.random()}`)
    } catch (error) {
      toast.error('Make sure you re-assign all employees using this department first.');
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Are you approving this leave?"
        description=""
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <div className="pt-4 space-x-2 flex items-center justify-end w-full">
          <Button disabled={loading} variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button disabled={loading} variant="destructive" onClick={() => onConfirm("REJECTED")}>Reject</Button>
          <Button disabled={loading} onClick={() => onConfirm("APPROVED")}>Approve</Button>
        </div>
      </Modal>
      {(data.status == "INITIATED") ? <Button onClick={() => setOpen(true)} size={"icon"} variant={"outline"} >
        <MousePointerClick className="h-4 w-4" />
      </Button> : <></>}
    </>
  );
};
