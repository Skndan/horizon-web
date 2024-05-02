"use client";

import { useState } from "react";
import { Clock, Edit, MoreHorizontal, Trash } from "lucide-react";
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

interface CellActionProps {
  data: Timesheet;
}

const formSchema = z.object({
  at: z.any(),
});

type FormValues = z.infer<typeof formSchema>

export const CellAction: React.FC<CellActionProps> = ({
  data,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });


  async function onSubmit(value: FormValues) {

    const clockOutTime = timeObjectToString(value.at);

    try {
      setLoading(true);
      try {
        await apiClient.get(`/time-sheet/manual-clock-out/${user?.profileId}/${data.updatedAt}/${clockOutTime}`).then((res) => {

          if (res.status === 200) {
            if (res.data.status == "IN") {
              // SET IN
              // setClockedIn(true);
              toast.success('You have clocked in', { icon: '🤝' });
            } else {
              // SET OUT
              // setClockedIn(false);
              toast.success('You have clocked out', { icon: '👋' });
            }

            // setLastCheckInTime(res.data.createdAt);
            router.push(`/`);
          }
        });
      } catch (error) {
        toast.error('Unable to punch your clock');
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

  return (
    <>
      <Modal
        title="Are you sure?"
        isOpen={open}
        onClose={() => setOpen(false)} description={"Enter manual clock out time"}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <FormField
              control={form.control}
              name="at"
              disabled={loading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manual End Time <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <TimePicker {...field} />
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
          <DropdownMenuItem disabled={data.status === "OUT"}
            onClick={() => setOpen(true)}
          >
            <Clock className="mr-2 h-4 w-4" /> Clock out
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled
            onClick={() => setOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
