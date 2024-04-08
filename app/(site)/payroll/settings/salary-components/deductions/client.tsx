"use client";
 
import { useRouter } from "next/navigation";
  
import { DataTable } from "@/components/ui/data-table"; 
import { columns } from "./columns";
import { EmptyStateTable } from "@/components/common/empty-state-table";  
import { SalaryTemplateItem } from "@/types/payroll";


interface DeductionClientProps {
  data: SalaryTemplateItem[];
}

export const DeductionClient: React.FC<DeductionClientProps> = ({
  data
}) => { 
  const router = useRouter();

  return (
    <>
      {data.length == 0 ? <EmptyStateTable
        title={"No deductions added"}
        description={"You have not added any deductions. Add one below."}
        action={"Add Deduction"}
        onClick={() => router.push(`/payroll/settings/salary-components/deductions/new`)}
      /> : <DataTable searchKey="name" columns={columns} data={data} />}
    </>
  );
};
