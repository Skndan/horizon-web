"use client";

import { EmptyStateTable } from "@/components/common/empty-state-table";
import { SubHeading } from "@/components/ui/sub-heading";
import { useAuth } from "@/context/auth-provider";
import apiClient from "@/lib/api/api-client";
import { useUpdateStore } from "@/store/use-update-store";
import { Task } from "@/types/task";
import { useState, useEffect } from "react"; 
import { formatDate } from "date-fns/format";
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";
import { Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const TaskPage = () => {

    const router = useRouter();
    const [data, setData] = useState<Task[]>([])
    const [isLoading, setLoading] = useState(false)
    const [isOpen, setOpen] = useState(false);
    const { user } = useAuth();
    const { flag } = useUpdateStore();
    const [date, setDate] = useState<Date | undefined>(new Date())

    async function fetchData() {
        setLoading(true)
        await apiClient.get(`/tasks/get-by-profile/${user?.profileId}/${formatDate(date!.toISOString(), "yyyy-MM-dd")}`).then((res) => res.data)
            .then((data) => {
                setData(data)
                setLoading(false)
            });
    }

    useEffect(() => {
        fetchData();
    }, [flag, date])

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <SubHeading title="✅ My Tasks" description="Your task list" />
                    {/* <Link href={`/my-space/tasks/new`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </Link> */}
                </div>

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
                                            title={"No task found"}
                                            description={"You have not tasks. Add one below."}
                                            action={"Assign Task"}
                                            onClick={() => router.push(`/my-space/tasks/new`)} />
                                        : <DataTable columns={columns} data={data} />
                                }
                            </div>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                            />
                        </div>
                    </>)
                }
            </div>
        </>)

}

export default TaskPage; 