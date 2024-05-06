"use client";

import { Button } from "@/components/ui/button";
import { SubHeading } from "@/components/ui/sub-heading";
import { Loader, Plus } from "lucide-react";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { DataTable } from "@/components/ui/data-table";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { useUpdateStore } from "@/store/use-update-store";
import Link from "next/link";
import { columns } from "./columns";
import { Timesheet } from "@/types/attendance";
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";

const OrgSettingsPage = () => {


  const router = useRouter();
  const [data, setData] = useState<Timesheet[]>([])
  const [isLoading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false);
  const { user } = useAuth();

  async function fetchData() {
    setLoading(true)
    await apiClient.get(`/time-sheet/get-by-profile/${user?.profileId}`).then((res) => res.data)
      .then((data) => {
        setData(data)
        setLoading(false)
      });
  }
  const { flag } = useUpdateStore();

  useEffect(() => {
    fetchData();
  }, [flag])


  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <SubHeading title="Timesheet" description="Your timesheet records" />
          <Link href={`/my-space/timesheet/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create
            </Button>
          </Link>
        </div>
        {isLoading ? (
          <div className="grid h-screen place-items-center">
            <Loader className="animate-spin h-5 w-5 mr-3" />
          </div>
        ) :
          (<>
            <div className='flex flex-row gap-4 pt-4'>
              <div className="flex-1">
                {
                  data.length == 0 ?
                    <EmptyStateTable
                      title={"No timesheet has submitted"}
                      description={"You have not submitted timesheet. Add one below."}
                      action={"Submit Timesheet"}
                      onClick={() => {
                        router.push(`/my-space/timesheet/new`);
                      }} />
                    : <DataTable searchKey="createdAt" columns={columns} data={data} />
                }
              </div>
            </div>
          </>)
        }
      </div>
    </>)
}

export default OrgSettingsPage; 