"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { DoorOpen } from "lucide-react";
import { useState } from "react";
import { Daylog } from "@/types/attendance";
import { DataTable } from "@/components/ui/data-table";
import { whosOutColumn } from "./whos-out-column";

interface ModalProps {
  inBreakList: Daylog[];
}

const WhosOutCard: React.FC<ModalProps> = ({
  inBreakList
}) => {

  const [isOpen, setOpen] = useState(false);
  

  return (
    <>

      <Sheet open={isOpen} onOpenChange={() => setOpen(false)}>
        <SheetContent side={'bottom'}>
          <SheetHeader>
            <SheetTitle>{"Check who's in break now"}</SheetTitle>
            {/* <SheetDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </SheetDescription> */}
          </SheetHeader>

          <DataTable searchKey="name" columns={whosOutColumn} data={inBreakList} />
        </SheetContent>
      </Sheet>

      <Card className="hover:bg-muted hover:cursor-pointer" onClick={() => setOpen(true)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">Whos Out</CardTitle>
          <DoorOpen />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">#{inBreakList.length}</div>
          <p className="text-sm text-muted-foreground">
             since 30 mins
          </p>
        </CardContent>
      </Card>
    </>
  )
}

export default WhosOutCard;