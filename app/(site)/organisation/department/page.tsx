"use client";

import { useRouter } from "next/navigation";
import apiClient from "@/lib/api/api-client";
import { Department } from "@/types/profile";
import { useState, useEffect } from "react";
import { useDepartmentSheet } from "@/store/sheet/use-department-sheet";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { columns } from "./components/columns";
import { DepartmentForm } from "./department-form";
import { Heading } from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DepartmentPage = () => {
    const router = useRouter();

    const [data, setData] = useState<Department[]>([])
    const [isLoading, setLoading] = useState(false)

    async function fetchData() {
        setLoading(true)
        await apiClient.get('/department').then((res) => res.data)
            .then((data) => {
                setData(data.content)
                setLoading(false)
            });
    }
    useEffect(() => {
        fetchData();
    }, [])

    const { isOpen, set, reset, department } = useDepartmentSheet();

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <Heading title={`Departments (${data.length})`} description="Manage your departments" />
                    <Button onClick={() => {
                        set(null);
                    }}>
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>
                <DepartmentForm
                    isOpen={isOpen}
                    onClose={() => {
                        reset();
                        fetchData();
                    }}
                    initialData={department}
                />
                <Separator />
                <DataTable searchKey="name" columns={columns} data={data} />
            </div>
        </div>)
}

export default DepartmentPage;