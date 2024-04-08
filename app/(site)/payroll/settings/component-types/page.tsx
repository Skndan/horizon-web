"use client";

import { Separator } from "@/components/ui/separator";
import { SubHeading } from "@/components/ui/sub-heading";
import { useEffect, useState } from "react";
import { Loader, Plus } from "lucide-react";
import { ComponentTypeForm } from "./component-type-form";
import apiClient from "@/lib/api/api-client";
import { ComponentType } from "@/types/payroll";
import { useUpdateStore } from "@/store/use-update-store";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ComponentTypesPage = () => {

    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState<ComponentType[]>([])
    const [isOpen, setOpen] = useState(false);

    async function fetchData() {
        await apiClient.get('/component-type').then((res) => res.data)
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
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <SubHeading title="Salary Component Types" description="Organisation Payroll Schedule" />

                    <Button onClick={() => setOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>

                </div>
                <Separator />
                <ComponentTypeForm
                    isOpen={isOpen}
                    onClose={() => {
                        setOpen(false);
                        fetchData();
                    }}
                    initialData={null}
                />
                <div className="flex-col">
                    <div className="flex-1">
                        {isLoading ?
                            (
                                <div className="grid h-screen place-items-center">
                                    <Loader className="animate-spin h-5 w-5 mr-3" />
                                </div>
                            )
                            : (

                                data.length == 0 ? <EmptyStateTable
                                    title={"No Types added"}
                                    description={"You have not added any types. Add one below."}
                                    action={"Add Types"}
                                    onClick={() => setOpen(true)}
                                /> : <DataTable searchKey="name" columns={columns} data={data} />

                            )}
                    </div>
                </div>
            </div>
        </>)
}

export default ComponentTypesPage;