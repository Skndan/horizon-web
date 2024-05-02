"use client";

import { useState } from "react";
import { CircleCheck, CircleX, Clock, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modals/alert-modal";
import apiClient from "@/lib/api/api-client";
import { useUpdateStore } from "@/store/use-update-store";
import { LeaveRequest } from "@/types/leave";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Daylog, Timesheet } from "@/types/attendance";
import { useAuth } from "@/context/auth-provider";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { stringToTimeObject, timeObjectToString } from "@/lib/utils/time-utils";
import { TimePicker } from "@/components/ui/time-picker";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CellActionProps {
  data: Timesheet;
}

const formSchema = z.object({
  remarks: z.string(),
});

type FormValues = z.infer<typeof formSchema>

// DRAFT, INITIATED, APPROVED, REJECTED
export const statuses = [
  {
    value: "TODO",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "INPROGRESS",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "REVIEW",
    label: "Review",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "DONE",
    label: "Done",
    icon: CheckCircledIcon,
  },

  {
    value: "CANCELLED",
    label: "Cancelled",
    icon: CrossCircledIcon,
  }
]

export const CellAction: React.FC<CellActionProps> = ({
  data,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const { set } = useUpdateStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });


  async function onSubmit(value: FormValues) {
    try {
      setLoading(true);
      try {
        data.status = "REJECTED";
        data.remarks = value.remarks;
        data.dayLogs = [];
        await apiClient.put(`/time-sheet/${data.id}`, data);
        set(`${Math.random()}`);
        toast.success('Status updated');
      } catch (error) {
        toast.error('Unable to process your request');
      } finally {

      }
      router.refresh();
    } catch (error) {
      toast.error('Unable to process your request');
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const onStatusChange = async (status: string) => {
    try {
      data.status = status;
      data.dayLogs = [];
      await apiClient.put(`/time-sheet/${data.id}`, data);
      set(`${Math.random()}`);
      toast.success('Status updated');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
    }
  }

  return (
    <>
      <Modal
        title="Are you sure?"
        isOpen={open}
        onClose={() => setOpen(false)} description={"Please leave a remark for the rejection"}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <FormField
              control={form.control}
              name="remarks"
              disabled={loading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder="Leave your remark" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col">
              <div className="space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button disabled={loading} type="submit">Continue</Button>
              </div>
            </div>
          </form>
        </Form>
      </Modal>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onStatusChange("APPROVED")} >
            <CircleCheck className="mr-2 h-4 w-4 text-green-500" /> Approve
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)} >
            <CircleX className="mr-2 h-4 w-4 text-red-500" /> Reject
          </DropdownMenuItem>
          {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={data.status} onValueChange={(e) => onStatusChange(e)}>
              {statuses.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
