"use client";
 
import { useRouter } from "next/navigation";
  
import { DataTable } from "@/components/ui/data-table"; 
import { columns } from "./columns";
import { EmptyStateTable } from "@/components/common/empty-state-table"; 
import { AllowanceDetail } from "../../../data";


interface EarningClientProps {
  data: AllowanceDetail[];
}

export const EarningClient: React.FC<EarningClientProps> = ({
  data
}) => { 
  const router = useRouter();

  return (
    <>
      {data.length == 0 ? <EmptyStateTable
        title={"No employees added"}
        description={"You have not added any employees. Add one below."}
        action={"Add Empoyee"}
        onClick={() => router.push(`/organisation/employee/new`)}
      /> : <DataTable searchKey="name" columns={columns} data={data} />}
    </>
  );
};
