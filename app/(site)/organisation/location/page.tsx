"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import apiClient from "@/lib/api/api-client";
import { Location } from "@/types/profile";
import { Loader, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./components/columns";
import { useDeleteStore } from "@/store/use-delete-store";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import Link from "next/link";

export const LocationPage = () => {

    const router = useRouter();
    const [data, setData] = useState<Location[]>([])
    const [isLoading, setLoading] = useState(true)
    const { flag } = useDeleteStore();

    async function fetchData() {
        setLoading(true)
        await apiClient.get('/location').then((res) => res.data)
            .then((data) => {
                console.log(`setting value`)
                setData(data.content)
                setLoading(false)
            });
        setLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, [flag])

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <Heading title={`Locations (${data.length})`} description="Manage your office locations" /> 
                    <Link href={`/organisation/location/new`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </Link>
                </div>
                <Separator />
                {isLoading ? (
                    <div className="grid h-screen place-items-center">
                        <Loader />
                    </div>
                ) : (


                    data.length == 0 ?
                        <EmptyStateTable
                            title={"No location added"}
                            description={"You have not added any locations. Add one below."}
                            action={"Add Location"}
                            onClick={() => router.push(`/organisation/location/new`)} />
                        : <DataTable searchKey="name" columns={columns} data={data} />

                )}

            </div>
        </div>)
}

export default LocationPage;