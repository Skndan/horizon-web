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
import { Workflow } from "@/types/hiring";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

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

    async function rearrange(data: Workflow[]) {

        var dd = [];
        for (let datum of data) {
            var d = {
                "id": datum.id,
                "transitionLevel": datum.transitionLevel
            }

            dd.push(d);
        }

        await apiClient.put(`/workflow/bulk-update`, dd);
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
                        <Heading title={`Workflow (${total})`} description="Manage your workflow" />
                        <Link href={`/hiring/workflow/new`}>
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
                                <AlertTitle>Causion</AlertTitle>
                                <AlertDescription>
                                    Changing the order may affect the exist candidates level in the pipeline
                                </AlertDescription>
                            </Alert>
                            {
                                data.length == 0 ?
                                    <EmptyStateTable
                                        title={"No workflow added"}
                                        description={"You have not added workflow. Add one below."}
                                        action={"Add workflow"}
                                        onClick={() => {
                                            router.push(`/hiring/workflow/new`);
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
                                                                        <div className="flex flex-row justify-between">
                                                                            <p>{item.transitionName}</p>
                                                                            <Link href={`/hiring/workflow/${item.id}`}>
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