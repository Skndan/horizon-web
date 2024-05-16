"use client";

import { useState } from "react";
import { Loader, MousePointerClick } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api/api-client";
import { useUpdateStore } from "@/store/use-update-store";
import { Modal } from "@/components/ui/modal";
import { Attendance } from "@/types/attendance";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface CellActionProps {
  data: Attendance;
}

const formSchema = z.object({
  remarks: z.string().min(1),
});

type AdjustmentFormValues = z.infer<typeof formSchema>

export const CellAction: React.FC<CellActionProps> = ({
  data,
}) => {

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [loading, setLoading] = useState(false);
  const { set } = useUpdateStore();

  const form = useForm<AdjustmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data
  });

  const onConfirm = async (status: string) => {
    try {
      data.status = status;

      if (status === "REJECTED") {
        setOpen1(true);
      } else {
        setLoading(true);
        await apiClient.put(`/attendance/${data.id}`, data);
        toast.success('Login time approved.');
        router.refresh();
        set(`${Math.random()}`) 
        setOpen(false);
        setLoading(false);
      }

    } catch (error) {
      toast.error('Unable to update status right now');
    } finally {

    }
  };



  const onSubmit = async (datum: AdjustmentFormValues) => {
    try {

    setLoading(true);
    data.status = "REJECTED";
    data.remarks = datum.remarks;
    await apiClient
      .put(`/attendance/${data.id}`, data)
      .then((res) => res.data)
      .then((data) => {
        toast.success("Remarks added and Request rejected");
        router.refresh();
        setOpen1(false);
        set(`${Math.random()}`)
      });
    } catch (error: any) {
        toast.error('Something went wrong.');
    } finally {
        setLoading(false);
    }
  };


  return (
    <>

      <Modal
        title="Drop some remarks before rejecting"
        description=""
        isOpen={open1}
        onClose={() => setOpen1(false)}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Textarea disabled={loading} placeholder="Reson for your leave request" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className="pt-4 space-x-2 flex items-center justify-end w-full">

              <Button disabled={loading} variant="outline" onClick={() => setOpen1(false)}>Cancel</Button>
              <Button disabled={loading} variant="destructive" onClick={() => onConfirm("REJECTED")}>
                {loading &&
                  <Loader className="animate-spin h-5 w-5 mr-3" />}
                Reject
              </Button>
            </div>
          </form>
        </Form>

      </Modal>



      <Modal
        title="Are you approving this time adjustment?"
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
