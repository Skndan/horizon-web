"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { LeaveRequestForm } from "../_components/leave-form";
import { LeaveType } from "@/types/leave";


const OnboardingPage = ({ params }: { params: { leaveRequestId: string } }) => {

    const [data, setData] = useState(null);

    const [isLoading, setLoading] = useState(false)

    const [leaveType, setLeaveType] = useState<LeaveType[]>([])


    useEffect(() => {
        (async () => {
            setLoading(true);

            const orgId = localStorage.getItem("orgId");

            if (params.leaveRequestId != 'new') {
                const employees = await apiClient.get(`/leave-request/${params.leaveRequestId}`);
                setData(employees.data)
            }

            const departments = await apiClient.get(`/leave/type/get-by-org/${orgId}`);
            setLeaveType(departments.data)

            setLoading(false);
        })()
    }, [])

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">

                {isLoading ? (
                    <div className="grid h-screen place-items-center">
                        <Loader className="animate-spin h-5 w-5 mr-3" />
                    </div>
                ) : (
                    <LeaveRequestForm
                        initialData={data}
                        leaveType={leaveType}
                    />)}
            </div>
        </div>)
}

export default OnboardingPage;