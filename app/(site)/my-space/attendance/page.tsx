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

export const MySpaceAttendancePage = () => {

    const [data, setData] = useState<Daylog[]>([])
    const [isLoading, setLoading] = useState(false)
    const [isOpen, setOpen] = useState(false);

    async function fetchData() {
        setLoading(true)
        const profileId = localStorage.getItem("profileId");
        await apiClient.get(`/time-sheet/day-log-by-profile/day-wise/${profileId}`).then((res) => res.data)
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
                <SubHeading title="Attendance" description="Your attendance record" /> 
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
                            {/* <div className="flex flex-col gap-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-md font-medium">
                                            Time Off Requests
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">#1</div>
                                        <p className="text-sm text-muted-foreground">
                                            Taken 1
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-md font-medium">
                                            Time Off Requests
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">#1</div>
                                    </CardContent>
                                </Card>
                            </div> */}
                        </div>
                    </>)
                }

            </div>
        </>)
}

export default MySpaceAttendancePage;