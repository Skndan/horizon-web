"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertModal } from "@/components/modals/alert-modal"
import { useState } from "react"
import apiClient from "@/lib/api/api-client"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { taskSchema } from "../_data/schema"
import { Eye, Trash } from "lucide-react"
import { useDeleteStore } from "@/store/use-delete-store"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original)

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { set } = useDeleteStore();

  const onConfirm = async () => {
    try {
      setLoading(true);
      await apiClient.delete(`/candidate/${task.applicationNumber}`).then((res) => {
        set(task.id ?? '');
        toast.success('Candidate deleted.');
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

  return (<>

    <AlertModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={onConfirm}
      loading={loading}
    />

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" /> View
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setOpen(true)}
          className="text-red-500"
        >
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.status} onValueChange={(e) => onStatusChange(e)}>
              {statuses.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}
        {/* <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  </>

  )
}
