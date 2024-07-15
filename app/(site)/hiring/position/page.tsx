"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import apiClient from "@/lib/api/api-client";
import { Loader, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
import { Position } from "@/types/hiring";
import Link from "next/link";

const PositionPage = () => {

    const { user } = useAuth();

    const [data, setData] = useState<Position[]>([])
    const [isLoading, setLoading] = useState(false)
    const [total, setTotal] = useState(0);

    async function fetchData() {
        setLoading(true)
        await apiClient.get(`/position/get-by-org/${user?.orgId}`).then((res) => res.data)
            .then((data) => {
                setData(data.content)
                setTotal(data.totalElements)
                setLoading(false)
            });
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <Heading title={`Positions (${total})`} description="Manage your job openings" />
                        <Link href={`/hiring/position/new`}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add
                            </Button>
                        </Link>
                    </div>
                    <Separator />
                    {isLoading ?
                    (
                        <div className="grid h-screen place-items-center">
                            <Loader className="animate-spin h-5 w-5 mr-3" />
                        </div>
                    )
                    : (<DataTable searchKey="title" columns={columns} data={data} />)} 
                </div>
            </div>
        </>)
}

export default PositionPage;