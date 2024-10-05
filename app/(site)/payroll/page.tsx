"use client";

import { Heading } from "@/components/ui/heading";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDeleteStore } from "@/store/use-delete-store";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { Address } from "@/types/profile";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RunPage from "./_components/run";
import TestPage from "./_components/test";

const PayrollPage = () => {

    const router = useRouter();
    const [data, setData] = useState<Address[]>([])
    const [isLoading, setLoading] = useState(true)
    const { flag } = useDeleteStore();

    async function fetchData() {
        setLoading(true)
        // await apiClient.get('/address').then((res) => res.data)
        //     .then((data) => {
        //         setData(data.content)
        //         setLoading(false)
        //     });
        setLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, [flag])

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <Heading title={`💰 Payroll Runs`} description="Manage your office locations" />
                    {/* <Link href={`/organisation/location/new`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Pay Run
                        </Button>
                    </Link> */}
                </div>
                {/* <Separator /> */}
                {isLoading ? (
                    <div className="grid h-screen place-items-center">
                        <Loader className="animate-spin h-5 w-5 mr-3" />
                    </div>
                ) : (
                    <Tabs defaultValue="run" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="run">Run Payroll</TabsTrigger> 
                            <TabsTrigger value="history">Payroll History</TabsTrigger>
                        </TabsList>
                        <TabsContent value="run" className="space-y-4">
                            <RunPage />
                        </TabsContent> 
                        <TabsContent value="history" className="space-y-4">
                            <EmptyStateTable
                                title={"No payroll runs"}
                                description={"You have not ran payrolls. Add one below."}
                                action={"Create Payroll Run"}
                                onClick={() => router.push(`/dashboard`)} />
                        </TabsContent>
                    </Tabs>
                )}

            </div>
        </div>)
}

export default PayrollPage;