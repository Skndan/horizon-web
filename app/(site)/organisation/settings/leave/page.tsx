"use client";

import { LeaveType } from "@/types/leave";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import apiClient from "@/lib/api/api-client";
import { Loader, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { columns } from "./components/columns"; 
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { SubHeading } from "@/components/ui/sub-heading";
import { LeaveTypeForm } from "./leave-form";
import { useUpdateStore } from "@/store/use-update-store";

export const LeaveSettingPage = () => {
    const router = useRouter();
    const [data, setData] = useState<LeaveType[]>([])
    const [isLoading, setLoading] = useState(true)
    const { flag } = useUpdateStore();
    const [isOpen, setOpen] = useState(false);



    async function fetchData() {
        setLoading(true)
        const orgId = localStorage.getItem("orgId");
        await apiClient.get(`/leave/type/get-by-org/${orgId}`).then((res) => res.data)
            .then((data) => {
                setData(data)
                setLoading(false)
            });
        setLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, [flag])

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                    <SubHeading title={`Leave Types (${data.length})`} description="Manage your leave types" />
                    <Button onClick={() => {
                        setOpen(true);
                    }}>
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>
                <LeaveTypeForm
                    isOpen={isOpen}
                    onClose={() => {
                        setOpen(false);
                        fetchData();
                    }}
                    initialData={null}
                />
                <Separator />
                {isLoading ? (
                    <div className="grid h-screen place-items-center">
                        <Loader className="animate-spin h-5 w-5 mr-3" />
                    </div>
                ) : (
                    data.length == 0 ?
                        <EmptyStateTable
                            title={"No Leave type added"}
                            description={"You have not added any leave type. Add one below."}
                            action={"Add Leave type"}
                            onClick={() => {
                                setOpen(true);
                            }} />
                        : <DataTable searchKey="name" columns={columns} data={data} />
                )}

            </div>
        </div>)
}

export default LeaveSettingPage;