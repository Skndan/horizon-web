"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator"; 

import { columns, EmployeeColumn } from "./columns";

interface EmployeeClientProps {
  data: EmployeeColumn[];
}

export const EmployeeClient: React.FC<EmployeeClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Employees (${data.length})`} description="Manage your employees" />
        <Button onClick={() => router.push(`/organisation/employee/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} /> 
    </>
  );
};
