import { EmptyStateTable } from "@/components/common/empty-state-table";
import { DataTable } from "@/components/ui/data-table";
import { useAuth } from "@/context/auth-provider";
import apiClient from "@/lib/api/api-client";
import { useUpdateStore } from "@/store/use-update-store";
import { Timesheet } from "@/types/attendance";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./columns";

interface TimesheetPageProps {
    status: string;
};

export const TimesheetPage: React.FC<TimesheetPageProps> = ({
    status
}) => {

    const router = useRouter();
    const [data, setData] = useState<Timesheet[]>([])
    const [isLoading, setLoading] = useState(false)
    const [isOpen, setOpen] = useState(false);
    const { user } = useAuth();
  
    async function fetchData() {
      setLoading(true)
      await apiClient.get(`/time-sheet/get-by-org/${user?.orgId}/${status}`).then((res) => res.data)
        .then((data) => {
          setData(data)
          setLoading(false)
        });
    }
    const { flag } = useUpdateStore();
  
    useEffect(() => {
      fetchData();
    }, [flag])
  

    return <>
        {isLoading ? (
            <div className="grid h-screen place-items-center">
                <Loader className="animate-spin h-5 w-5 mr-3" />
            </div>
        ) :
            (<>
                <div className='flex flex-row gap-4'>
                    <div className="flex-1">
                        {
                            data.length == 0 ?
                                <EmptyStateTable
                                    title={"No timesheet found"}
                                    description={"It is so empty here"}
                                    action={''}
                                    onClick={() => { }} />
                                : <DataTable searchKey="createdAt" columns={columns} data={data} />
                        }
                    </div>
                </div>
            </>)
        }
    </>

};

export default TimesheetPage;