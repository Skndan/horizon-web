"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "./columns"; 
import { EmptyStateTable } from "@/components/common/empty-state-table";
import Link from "next/link";
import { Shift } from "@/types/attendance";


interface ShiftTableProps {
  data: Shift[];
}

export const ShiftTable: React.FC<ShiftTableProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Shifts (${data.length})`} description="Manage your employee's shifts" />
        <Link href={`/attendance/shifts/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </Link>
      </div>
      <Separator />

      {data.length == 0 ? <EmptyStateTable
        title={"No shifts added"}
        description={"You have not added any shifts. Add one below."}
        action={"Add Empoyee"}
        onClick={() => router.push(`/organisation/employee/new`)}
      /> : <DataTable searchKey="name" columns={columns} data={data} />}
    </>
  );
};
