"use client";
 
import apiClient from "@/lib/api/api-client";
import { Department } from "@/types/profile";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { columns } from "./components/columns";
import { DepartmentForm } from "./department-form";
import { Heading } from "@/components/ui/heading";
import { Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateStore } from "@/store/use-update-store";
import { EmptyStateTable } from "@/components/common/empty-state-table";

export const DepartmentPage = () => { 

    const [data, setData] = useState<Department[]>([])
    const [isLoading, setLoading] = useState(true)
    const [isOpen, setOpen] = useState(false);

    async function fetchData() {
        setLoading(true)
        await apiClient.get('/department').then((res) => res.data)
            .then((data) => {
                setData(data.content)
                setLoading(false)
            });
    }
    const { flag } = useUpdateStore();

    useEffect(() => {
        fetchData();
    }, [flag])



    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <Heading title={`Departments (${data.length})`} description="Manage your departments" />
                    <Button onClick={() => {
                        setOpen(true);
                    }}>
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>
                <DepartmentForm
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
                ) :

                    data.length == 0 ? <EmptyStateTable
                        title={"No departments added"}
                        description={"You have not added any departments. Add one below."}
                        action={"Add Department"}
                        onClick={() => setOpen(true)}
                    /> : <DataTable searchKey="name" columns={columns} data={data} />

                }


            </div>
        </div>)
}

export default DepartmentPage;