"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SubHeading } from "@/components/ui/sub-heading";
import { Loader, Plus } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./_components/columns";
import { LeaveBalance, LeaveRequest } from "@/types/leave";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { useUpdateStore } from "@/store/use-update-store";
import Link from "next/link";
import { useAuth } from "@/context/auth-provider";

const LeaveTrackerPage = () => {

    const [data, setData] = useState<LeaveRequest[]>([])
    const [balance, setBalance] = useState<LeaveBalance[]>([])
    const [isLoading, setLoading] = useState(false)
    const [isOpen, setOpen] = useState(false);
    const {user} = useAuth();

    async function fetchData() {
        setLoading(true) 

        // TODO: make it a chain
        await apiClient.get(`/leave-request/get-by-profile/${user?.profileId}`).then((res) => res.data)
            .then(async (data) => {
                setData(data)
                await apiClient.get(`/leave/balance/${user?.profileId}`).then((res) => res.data)
                    .then((data) => {
                        setBalance(data)
                        setLoading(false)
                    });
            });
    }
    const { flag } = useUpdateStore();

    useEffect(() => {
        fetchData();
    }, [flag])

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <SubHeading title="My Leave" description="Manage your leave requests and check balance" />
                    <Link href={`/my-space/leave-request/new`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Request
                        </Button>   
                    </Link>
                </div>
                <Separator />
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
                                        : <DataTable searchKey="name" columns={columns} data={data} />
                                }
                            </div>
                            <div className="flex flex-col gap-4"> 
                                {balance.map((balance) => (
                                    <Card key={balance.id}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-md font-medium">
                                                {balance.leaveType.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">#{balance.balance}</div>
                                            <p className="text-sm text-muted-foreground">
                                                Already taken { balance.leaveType.count - balance.balance}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}


                            </div>
                        </div>
                    </>)
                }
            </div>
        </>)
}

export default LeaveTrackerPage;