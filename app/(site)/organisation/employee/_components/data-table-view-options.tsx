"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { MixerHorizontalIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatString } from "@/lib/utils/string-utils"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </SheetTrigger>
      <SheetContent className="gap-16">
        <SheetHeader>
          <SheetTitle>Toggle columns</SheetTitle>
          <SheetDescription>Select your focused columns</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full max-h-[90vh] w-full">
          <div className="h-full overflow-y-auto py-4">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" && column.getCanHide()
              )
              .map((column) => {
                return (

                  <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow mb-2" key={column.id}>
                    <Checkbox id={column.id} checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)} />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={column.id}
                        className="capitalize text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {formatString(column.id)}
                      </Label>
                    </div>
                  </div>
                )
              })}
          </div>


        </ScrollArea>
      </SheetContent>
    </Sheet>

    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button
    //       variant="outline"
    //       size="sm"
    //       className="ml-auto h-8 lg:flex"
    //     >
    //       <MixerHorizontalIcon className="mr-2 h-4 w-4" />
    //       View
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end" className="w-[150px]">
    //     <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
    //     <DropdownMenuSeparator />
    //     {table
    //       .getAllColumns()
    //       .filter(
    //         (column) =>
    //           typeof column.accessorFn !== "undefined" && column.getCanHide()
    //       )
    //       .map((column) => {
    //         return (
    //           <DropdownMenuCheckboxItem
    //             key={column.id}
    //             className="capitalize"
    //             checked={column.getIsVisible()}
    //             onCheckedChange={(value) => column.toggleVisibility(!!value)}
    //           >
    //             {column.id}
    //           </DropdownMenuCheckboxItem>
    //         )
    //       })}
    //   </DropdownMenuContent>
    // </DropdownMenu>
  )
}
