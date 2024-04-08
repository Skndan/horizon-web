"use client";
 
import { useRouter } from "next/navigation";
  
import { DataTable } from "@/components/ui/data-table"; 
import { columns } from "./columns";
import { EmptyStateTable } from "@/components/common/empty-state-table";

interface EarningClientProps {
  data: any;
}

export const EarningClient: React.FC<EarningClientProps> = ({
  data
}) => { 
  const router = useRouter();

  return (
    <>
      {data.length == 0 ? <EmptyStateTable
        title={"No earnings added"}
        description={"You have not added any earnings. Add one below."}
        action={"Add Earnings"}
        onClick={() => router.push(`/payroll/settings/salary-components/earnings/new`)}
      /> : <DataTable searchKey="name" columns={columns} data={data} />}
    </>
  );
};
