"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import apiClient from "@/lib/api/api-client";
import { Edit, GripVertical, Loader, Plus, SlashIcon, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import Link from "next/link";
import { WorkflowLine } from "@/types/hiring";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { InterviewStageCell } from "@/components/common/status-cell";

const WorkflowPage = ({ params }: { params: { workflowId: string } }) => {

    const { user } = useAuth();
    const router = useRouter();

    const [data, setData] = useState<WorkflowLine[]>([])
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [total, setTotal] = useState(0);

    async function fetchData() {
        setLoading(true)
        await apiClient.get(`/workflow-line/get-by-workflow/${params.workflowId}`).then((res) => res.data)
            .then((data) => {
                setData(data.content)
                setTotal(data.totalElements)
                setLoading(false)
            }).catch(error => {
                // Handle errors
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    if (error.response.status === 404) {


                        // Inform the user about the bad request
                        // alert('Bad request. Please check your input.');
                        toast.error("Workflow ID is not present");
                        setLoading(false);
                        setError(true);
                    } else {
                        // For other errors, log the error message

                    }
                } else {
                    // The request was made but no response was received

                }
            });
    }

    async function rearrange(data: WorkflowLine[]) {

        var dd = [];
        for (let datum of data) {
            var d = {
                "id": datum.id,
                "transitionLevel": datum.transitionLevel
            }

            dd.push(d);
        }

        await apiClient.put(`/workflow-line/bulk-update`, dd);
    }

    useEffect(() => {
        fetchData();
    }, [])

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(data);
        const [removed] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, removed);

        // Update the index of the items based on the new position
        reorderedItems.forEach((item, index) => {
            item.transitionLevel = index;
        });

        setData(reorderedItems);

        // call api
        await rearrange(reorderedItems);
    };

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <div className="flex flex-col gap-2">
                            <Breadcrumb className="sm:block hidden">
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/hiring/workflow">Workflow</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator>
                                        <SlashIcon />
                                    </BreadcrumbSeparator>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Steps</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <Heading title={`📊 Workflow Steps (${total})`} description="Manage your workflow steps" />
                        </div>

                        <Link href={`/hiring/workflow/${params.workflowId}/line/new`}>
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
                        ) :
                        <>
                            <Alert variant={"warning"}>
                                <TriangleAlert className="h-4 w-4" />
                                <AlertTitle>Warning</AlertTitle>
                                <AlertDescription>
                                    Changing the order may affect the exist candidates level in the pipeline
                                </AlertDescription>
                            </Alert>
                            {
                                data.length == 0 ?
                                    !error && <EmptyStateTable
                                        title={"No workflow added"}
                                        description={"You have not added workflow. Add one below."}
                                        action={"Add workflow"}
                                        onClick={() => {
                                            router.push(`/hiring/workflow/${params.workflowId}/line/new`);
                                        }} /> :
                                    <DragDropContext onDragEnd={onDragEnd}>
                                        <Droppable droppableId="droppable">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} className={" flex-grow flex flex-col gap-2"}>
                                                    {data.map((item, index) => (
                                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                                            {(provided) => (
                                                                <Alert ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}>
                                                                    <GripVertical className="h-4 w-4" />
                                                                    <AlertTitle>
                                                                        <div className="flex flex-row justify-between items-center">
                                                                            <div className="flex flex-row">
                                                                                <InterviewStageCell stage={item.stage} />
                                                                                <Separator orientation="vertical" className="mx-2 h-4" />
                                                                                <p>{item.transitionName}</p>
                                                                                <p>{item.approver.name}</p>
                                                                            </div>
                                                                            <Link href={`/hiring/workflow/${params.workflowId}/line/${item.id}`}>
                                                                                <Button variant="outline" size="icon">
                                                                                    <Edit className="h-4 w-4" />
                                                                                </Button>
                                                                            </Link>
                                                                        </div>
                                                                    </AlertTitle>
                                                                </Alert>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                            }
                        </>}
                </div>
            </div>
        </>)
}

export default WorkflowPage;