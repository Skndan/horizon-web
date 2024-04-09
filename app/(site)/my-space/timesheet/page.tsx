"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SubHeading } from "@/components/ui/sub-heading";
import { Loader, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { DataTable } from "@/components/ui/data-table";
import { LeaveRequest } from "@/types/leave";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { useUpdateStore } from "@/store/use-update-store";
import Link from "next/link";
import { columns } from "./columns";
import { Daylog } from "@/types/attendance";
import { useAuth } from "@/context/auth-provider";

const OrgSettingsPage = () => {


  const [data, setData] = useState<Daylog[]>([])
  const [isLoading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false);
  const { user } = useAuth();

  async function fetchData() {
    setLoading(true)
    await apiClient.get(`/time-sheet/day-log-by-profile/day-wise/${user?.profileId}`).then((res) => res.data)
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
            <div className='flex flex-row gap-4'>
              <div className="flex-1">
                {
                  data.length == 0 ?
                    <EmptyStateTable
                      title={"No request found"}
                      description={"You have not request for leave. Add one below."}
                      action={"Request Leave"}
                      onClick={() => {
                        setOpen(true);
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