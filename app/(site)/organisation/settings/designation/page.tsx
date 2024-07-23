"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import apiClient from "@/lib/api/api-client";
import { Loader, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { SubHeading } from "@/components/ui/sub-heading"; 
import { useAuth } from "@/context/auth-provider";
import { columns } from "./_components/columns";
import { DesignationForm } from "./designation-form";
import { Designation } from "@/types/profile";
import { useUpdateStore } from "@/store/use-update-store";

const DesignationPage = () => {
    const router = useRouter();
    const [data, setData] = useState<Designation[]>([])
    const [isLoading, setLoading] = useState(true)
    const { flag, set } = useUpdateStore();
    const [isOpen, setOpen] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        function fetchData() {
            setLoading(true)
            apiClient.get(`/designation/get-by-org/${user?.orgId}`).then((res) => res.data)
                .then((data) => {
                    setData(data.content)
                    setLoading(false)
                });
            setLoading(false)
        }
        fetchData();
    }, [flag])

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                    <SubHeading title={`Designations (${data.length})`} description="Manage your designations" />
                    <Button onClick={() => {
                        setOpen(true);
                    }}>
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>
                <DesignationForm
                    isOpen={isOpen}
                    onClose={() => {
                        setOpen(false);
                        set(`${Math.random()}`);
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
                            title={"No Designations added"}
                            description={"You have not added any designations. Add one below."}
                            action={"Add Designation"}
                            onClick={() => {
                                setOpen(true); 
                            }} />
                        : <DataTable searchKey="name" columns={columns} data={data} />
                )}

            </div>
        </div>)
}

export default DesignationPage;