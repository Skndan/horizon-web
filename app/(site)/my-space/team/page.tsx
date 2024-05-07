"use client";

import { Separator } from "@/components/ui/separator";
import { SubHeading } from "@/components/ui/sub-heading";
import { Loader } from "lucide-react";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./_components/columns";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { useUpdateStore } from "@/store/use-update-store";
import { useAuth } from "@/context/auth-provider";
import { Profile } from "@/types/profile";

const TeamPage = () => {

    const [data, setData] = useState<Profile[]>([])
    const [isLoading, setLoading] = useState(false)
    const { user } = useAuth();

    async function fetchData() {
        setLoading(true)
        await apiClient.get(`/profile/get-by-department/${user?.departmentId}`).then((res) => res.data)
            .then(async (data) => {
                setData(data)
            }).finally(() => setLoading(false));

    }
    const { flag } = useUpdateStore();

    useEffect(() => {
        fetchData();
    }, [flag])

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <SubHeading title="My Team" description="Meet your team" />
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
                                            title={"Looks like your are an one man army"}
                                            description={""}
                                            onClick={() => { }}
                                            action={null} />
                                        : <DataTable searchKey="name" columns={columns} data={data} />
                                }
                            </div>
                        </div>
                    </>)
                }
            </div>
        </>)
}

export default TeamPage;