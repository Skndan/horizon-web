"use client";
 
import { useRouter } from "next/navigation";
  
import { DataTable } from "@/components/ui/data-table"; 
import { columns } from "./columns";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { Attendance } from "../data";


interface AttendanceClientProps {
  data: Attendance[];
}

export const TodayAttendanceClient: React.FC<AttendanceClientProps> = ({
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
