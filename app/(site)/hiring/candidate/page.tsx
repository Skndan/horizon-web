"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import apiClient from "@/lib/api/api-client";
import { Reports } from "@/types/reports";
import toast from "react-hot-toast";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";
import { CircleAlert, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { dateObjectToString, timeObjectToString } from "@/lib/utils/time-utils";
import { addMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
import { Candidate } from "@/types/hiring";
import Link from "next/link";

const CandidatePage = () => {

    const { user } = useAuth();

    const router = useRouter();
    const [data, setData] = useState<Candidate[]>([])
    const [isLoading, setLoading] = useState(false)

    async function fetchData() {
        setLoading(true)
        await apiClient.get(`/candidate/get-by-org/${user?.orgId}`).then((res) => res.data)
            .then((data) => {
                setData(data.content)
                setLoading(false)
            });
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <Heading title={`Candidates (3)`} description="Manage your candidates" />
                        <Link href={`/hiring/candidate/new`}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add
                            </Button>
                        </Link>
                    </div>
                    <Separator />
                    <DataTable searchKey="name" columns={columns} data={data} />
                    {/* <EmptyStateTable
                        title={"No request found"}
                        description={"There are no leave request"}
                        action={"Add candidate"}
                        onClick={() => { }} /> */}

                </div>
            </div>
        </>)
}

export default CandidatePage;