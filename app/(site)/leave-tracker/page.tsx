"use client";

import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { DataTable } from "@/components/ui/data-table";
import { LeaveRequest } from "@/types/leave";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { useUpdateStore } from "@/store/use-update-store";
import { columns } from "./columns";
import { Heading } from "@/components/ui/heading";
import { useAuth } from "@/context/auth-provider";
import CustomTable from "./custom-table";

const LeaveTrackerPage = () => {

    const [data, setData] = useState<LeaveRequest[]>([])
    const [balance, setBalance] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const { user } = useAuth();

    async function fetchData() {
        setLoading(true)
        await apiClient.get(`/leave-request/get-by-organisation/${user?.orgId}`).then((res) => res.data)
            .then(async (data) => {
                setData(data)
                await apiClient.get(`/leave/balance/org/${user?.orgId}`).then((res) => res.data)
                    .then((data) => {
                        setBalance(data)
                        setLoading(false)
                    });

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
                <Tabs defaultValue="request" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="request">Requests</TabsTrigger>
                        <TabsTrigger value="balance">Balance</TabsTrigger>
                        {/* <TabsTrigger value="shift_calendar">Shifts Calendar</TabsTrigger>  */}
                    </TabsList>
                    <TabsContent value="request" className="space-y-4">
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
                    </TabsContent>
                    <TabsContent value="balance" className="space-y-4">{isLoading ? (
                        <div className="grid h-screen place-items-center">
                            <Loader className="animate-spin h-5 w-5 mr-3" />
                        </div>
                    ) :
                        balance ?
                            <CustomTable data={balance} /> :
                            <EmptyStateTable
                                title={"No request found"}
                                description={"There are no leave request"}
                                action={""}
                                onClick={() => { }} />
                    }</TabsContent>
                </Tabs>
            </div>
        </>)
}

export default LeaveTrackerPage;