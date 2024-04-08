"use client";

import { useRouter } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { SalaryTemplate } from "@/types/payroll";
import { SubHeading } from "@/components/ui/sub-heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface SalaryTemplateClientProps {
  data: SalaryTemplate[];
}

export const SalaryTemplateClient: React.FC<SalaryTemplateClientProps> = ({
  data
}) => {
  const router = useRouter();

  return (
    <>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <SubHeading title="Salary Templates" description="Salary Template" />
          <Link href={`/payroll/settings/salary-templates/new`}> 
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
          </Link>
         
        </div>
        <Separator />
        {/* <ComponentTypeForm
          isOpen={isOpen}
          onClose={() => {
            setOpen(false);
            fetchData();
          }}
          initialData={null}
        /> */}
        <div className="flex-col">
          <div className="flex-1">
            {data.length == 0 ? <EmptyStateTable
              title={"No salary template added"}
              description={"You have not added any salary templates. Add one below."}
              action={"Add Template"}
              onClick={() => router.push(`/payroll/settings/salary-templates/new`)}
            /> : <DataTable searchKey="name" columns={columns} data={data} />}
          </div>
        </div>
      </div>
    </>
  );
};
