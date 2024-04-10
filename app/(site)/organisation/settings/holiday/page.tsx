"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import apiClient from "@/lib/api/api-client";
import { Loader, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { columns } from "./components/columns";
import { useDeleteStore } from "@/store/use-delete-store";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { SubHeading } from "@/components/ui/sub-heading";
import { HolidayForm } from "./holiday-form";
import { format } from "date-fns";
import { Holiday } from "@/types/holiday";
import { useUserStore } from "@/store/use-user-store";
import { useAuth } from "@/context/auth-provider";

const HolidayPage = () => {
    const router = useRouter();
    const [data, setData] = useState<Holiday[]>([])
    const [isLoading, setLoading] = useState(true)
    const { flag, set } = useDeleteStore();
    const [isOpen, setOpen] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        function fetchData() {
            setLoading(true)
            apiClient.get(`/holiday/${user?.orgId}/${format(new Date(), "yyyy")}`).then((res) => res.data)
                .then((data) => {
                    setData(data)
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
                    <SubHeading title={`Holidays (${data.length})`} description="Manage your holidays" />
                    <Button onClick={() => {
                        setOpen(true);
                    }}>
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>
                <HolidayForm
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
                            title={"No Holidays added"}
                            description={"You have not added any holidays. Add one below."}
                            action={"Add Holiday"}
                            onClick={() => {
                                setOpen(true);
                            }} />
                        : <DataTable searchKey="name" columns={columns} data={data} />
                )}

            </div>
        </div>)
}

export default HolidayPage;