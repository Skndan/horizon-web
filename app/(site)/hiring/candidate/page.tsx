"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import apiClient from "@/lib/api/api-client";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Candidate, WorkflowLine } from "@/types/hiring";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { useWorkflow } from "@/store/use-workflow-store";
import { DataTableRowActions } from "./_components/data-table-row-actions";
import { DataTableColumnHeader } from "./_components/data-table-column-header";
import { source } from "./_data/data";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { useDeleteStore } from "@/store/use-delete-store";

const CandidatePage = () => {

    const { user } = useAuth();

    const router = useRouter();
    const [data, setData] = useState<Candidate[]>([])
    const [workflow, setWorkflow] = useState<WorkflowLine[]>([])
    const [isLoading, setLoading] = useState(true)
    const [total, setTotal] = useState(0);
    const { flag } = useDeleteStore();
    const { set } = useWorkflow();

    async function fetchData() {
        await apiClient.get(`/candidate/get-by-org/${user?.orgId}`).then((res) => res.data)
            .then((data) => {
                setData(data.content)
                setTotal(data.totalElements)
            });

        await apiClient.get(`/workflow-line/get-by-org/${user?.orgId}`).then((res) => res.data)
            .then((data) => {
                setWorkflow(data.content)
                set(data.content)
            });
        setLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, [flag])

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <Heading title={`Candidates (${total})`} description="Manage your candidates" />
                        <Link href={`/hiring/candidate/new`}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add
                            </Button>
                        </Link>
                    </div>
                    <Separator />
                  {  
                    data.length == 0 ?
                                    <EmptyStateTable
                                        title={"No candidate added"}
                                        description={"You have not added candidate. Add one below."}
                                        action={"Add candidate"}
                                        onClick={() => {
                                            router.push(`/hiring/candidate/new`);
                                        }} /> :

                    <DataTable columns={[
                        {
                            accessorKey: "name",
                            header: ({ column }) => (
                                <DataTableColumnHeader column={column} title="Name" />
                            )
                        },
                        {
                            accessorKey: "position.title",
                            header: ({ column }) => (
                                <DataTableColumnHeader column={column} title="Position" />
                            )
                        },
                        {
                            accessorKey: "email",
                            header: ({ column }) => (
                                <DataTableColumnHeader column={column} title="Email" />
                            )
                        },
                        {
                            accessorKey: "mobile",
                            header: ({ column }) => (
                                <DataTableColumnHeader column={column} title="Mobile" />
                            )
                        },
                        // {
                        //     accessorKey: "latestTransition.transitionName",
                        //     header: ({ column }) => (
                        //         <DataTableColumnHeader column={column} title="Level" />
                        //     ),
                        //     cell: ({ row }) => {
                        //         const reportingManager = row.original.latestTransition.transitionName;
                        //         const status = workflow.find(
                        //             (workflow) => workflow.transitionName === reportingManager
                        //         )

                        //         if (!status) {
                        //             return null
                        //         }

                        //         return (
                        //             <div className={`flex w-[100px] items-center`}>
                        //                 <span>{status.transitionName}</span>
                        //             </div>
                        //         )
                        //     },
                        //     filterFn: (row, id, value) => {
                        //         return value.includes(row.getValue(id))
                        //     },
                        // }, 
                        {
                            accessorKey: "source",
                            header: ({ column }) => (
                                <DataTableColumnHeader column={column} title="Source" />
                            ),
                            cell: ({ row }) => {
                                const priority = source.find(
                                    (priority) => priority.value === row.getValue("source")
                                )

                                if (!priority) {
                                    return null
                                }

                                return (
                                    <div className="flex items-center">
                                        <span>{priority.label}</span>
                                    </div>
                                )
                            },
                            filterFn: (row, id, value) => {
                                return value.includes(row.getValue(id))
                            },
                        },
                        {
                            id: "actions",
                            cell: ({ row }) => <DataTableRowActions row={row} />,
                        },
                    ]} data={data} level={workflow} />
                }
                </div>
            </div>
        </>)
}

export default CandidatePage;