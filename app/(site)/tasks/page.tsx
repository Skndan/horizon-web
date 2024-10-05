"use client";

import { useAuth } from "@/context/auth-provider";
import { useUpdateStore } from "@/store/use-update-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { formatDate } from "date-fns/format";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import { EmptyStateTable } from "@/components/common/empty-state-table"; 
import { Calendar } from "@/components/ui/calendar";
import { OrganisationTask, Task } from "@/types/task";
import { Heading } from "@/components/ui/heading";
import { columns } from "../my-space/tasks/_components/columns";
import { DataTable } from "../my-space/tasks/_components/data-table";

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
        await apiClient.get(`/tasks/get-by-org/${user?.orgId}/${formatDate(date!.toISOString(), "yyyy-MM-dd")}`).then((res) => res.data)
            .then((data) => {
                setData(data.content)
                setLoading(false)
            });
    }

    useEffect(() => {
        fetchData();
    }, [flag, date])

    return (
        <>
            <div className="space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <Heading title="✅ Tasks" description="Your task list" />
                    <Link href={`/tasks/new`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </Link>
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
                                            onClick={() => router.push(`/tasks/new`)} />
                                        :
                                        <DataTable columns={columns} data={data} /> 
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
};

export default TaskPage;