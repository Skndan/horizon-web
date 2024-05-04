"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmployeePayrollRunSchema } from "./schema"
import { statuses } from "./data"
import { AlertModal } from "@/components/modals/alert-modal"
import { Modal } from "@/components/ui/modal"
import { useState } from "react"
import apiClient from "@/lib/api/api-client"
import toast from "react-hot-toast"
import { usePathname, useRouter } from "next/navigation"
import { revalidatePath } from "next/cache";
import { useUpdateStore } from "@/store/use-update-store"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = EmployeePayrollRunSchema.parse(row.original)

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const { set } = useUpdateStore();



  const onStatusChange = async (status: string) => {
    try {
      // task.status = status;
      // await apiClient.put(`/tasks/${task.id}`, task);
      // set(`${Math.random()}`);
      // toast.success('Status updated');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
    }
  }

  return (<>

    {/* <Modal
      title={task.title}
      description={task.description}
      isOpen={open}
      onClose={() => setOpen(false)}
    /> */}

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
        <DropdownMenuItem onClick={() => setOpen(true)}>View</DropdownMenuItem>

        {usePathname() === "/tasks" && <DropdownMenuItem onClick={() => router.push(`/tasks/${task.id}`)}>Edit</DropdownMenuItem>}

        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {/* <DropdownMenuRadioGroup value={task.status} onValueChange={(e) => onStatusChange(e)}>
              {statuses.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup> */}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {/* <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  </>

  )
}
