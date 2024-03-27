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
import { Heading } from "@/components/ui/heading";

export const LeaveTrackerPage = () => {

    const [data, setData] = useState<LeaveRequest[]>([])
    const [isLoading, setLoading] = useState(false)

    async function fetchData() {
        setLoading(true)
        const orgId = localStorage.getItem("orgId");
        await apiClient.get(`/leave-request/get-by-organisation/${orgId}`).then((res) => res.data)
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
            <div className="space-y-6 p-8">
                <div className="flex items-center justify-between">
                    <Heading title="Leave Tracker" description="Manage your organisation address here" />
                    {/* <Link href={`/leave-tracker/new`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </Link> */}
                </div>
                <Separator />
                {isLoading ? (
                    <div className="grid h-screen place-items-center">
                        <Loader className="animate-spin h-5 w-5 mr-3" />
                    </div>
                ) :
                    data.length == 0 ?
                        <EmptyStateTable
                            title={"No request found"}
                            description={"There are no leave request"}
                            action={""}
                            onClick={() => { }} />
                        : <DataTable searchKey="profile.name" columns={columns} data={data} />
                }
            </div>
        </>)
}

export default LeaveTrackerPage;