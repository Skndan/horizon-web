"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import apiClient from "@/lib/api/api-client";
import { Edit, GripVertical, Loader, Plus, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import Link from "next/link";
import { Workflow, WorkflowLine } from "@/types/hiring";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

const WorkflowPage = () => {

    const { user } = useAuth();
    const router = useRouter();

    const [data, setData] = useState<Workflow[]>([])
    const [isLoading, setLoading] = useState(false)
    const [total, setTotal] = useState(0);

    async function fetchData() {
        setLoading(true)
        await apiClient.get(`/workflow/get-by-org/${user?.orgId}`).then((res) => res.data)
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
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <Heading title={`📊 Workflows (${total})`} description="Manage your workflows" />
                    <Link href={`/hiring/workflow/new`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </Link>
                </div>
                {/* <DepartmentForm
                isOpen={isOpen}
                onClose={() => {
                    setOpen(false);
                    fetchData();
                }}
                initialData={null}
            /> */}
                <Separator />
                {isLoading ? (
                    <div className="grid h-screen place-items-center">
                        <Loader className="animate-spin h-5 w-5 mr-3" />
                    </div>
                ) :
                    data.length == 0 ? <EmptyStateTable
                        title={"No workflows added"}
                        description={"You have not added any workflows. Add one below."}
                        action={"Add Workflow"}
                        onClick={() => router.push(`/hiring/workflow/new`)}
                    /> : <DataTable searchKey="name" columns={columns} data={data} />
                }
            </div>
        </div>)
}

export default WorkflowPage;