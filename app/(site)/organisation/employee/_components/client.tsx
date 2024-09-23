"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"; 
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "./columns";
import { Address, Department, Profile } from "@/types/profile";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import Link from "next/link";
import { DataTable } from "./data-table";


interface EmployeeClientProps {
  data: Profile[];
  department: Department[];
  address: Address[];
}

export const EmployeeClient: React.FC<EmployeeClientProps> = ({
  data,
  department,
  address
}) => {
  const router = useRouter();


  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Employees (${data.length})`} description={`Manage your employees`} />
        <Link href={`/organisation/employee/new?tab=info`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </Link>
      </div>
      <Separator />

      {data.length == 0 ? <EmptyStateTable
        title={"No employees added"}
        description={"You have not added any employees. Add one below."}
        action={"Add Empoyee"}
        onClick={() => router.push(`/organisation/employee/new?tab=info`)}
      /> : <DataTable columns={columns} data={data} department={department} address={address} />}
    </>
  );
};
