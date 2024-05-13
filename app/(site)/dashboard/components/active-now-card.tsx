"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { MonitorCheck } from "lucide-react";
import { useState } from "react";
import { Daylog } from "@/types/attendance";
import { DataTable } from "@/components/ui/data-table";
import { activeColumns } from "./active-column";

interface ModalProps {
  activeList: Daylog[];
}

const ActiveNowCard: React.FC<ModalProps> = ({
  activeList
}) => {

  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={() => setOpen(false)}> 
        <SheetContent side={'bottom'}>
          <SheetHeader>
            <SheetTitle>{"Check who's active now"}</SheetTitle>
            {/* <SheetDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </SheetDescription> */}
          </SheetHeader>
          
          <DataTable searchKey="name" columns={activeColumns} data={activeList} />
        </SheetContent>
      </Sheet>
 
      <Card className="hover:bg-muted hover:cursor-pointer" onClick={() => setOpen(true)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">
            Active Now
          </CardTitle>
          <MonitorCheck />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">#{activeList.length}</div>
          <p className="text-sm text-muted-foreground">
            since last 30 mins
          </p>
        </CardContent>
      </Card>
    </>
  )
}

export default ActiveNowCard;