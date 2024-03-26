"use client";

import { useRouter } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { Daylog } from "@/types/attendance";


interface AttendanceClientProps {
  data: Daylog[] | [];
}

export const TodayAttendanceClient: React.FC<AttendanceClientProps> = ({
  data
}) => { 
  return (
    <>
      {data.length == 0 ? <EmptyStateTable
        title={"No logs recorded"}
        description={"You can see who are logged in today"}
        action={null}
        onClick={()=>{}}
      /> : <DataTable searchKey="name" columns={columns} data={data} />}
    </>
  );
};
