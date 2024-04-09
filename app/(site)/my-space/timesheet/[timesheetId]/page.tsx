"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { TimesheetForm } from "./timesheet-form";
import { LeaveType } from "@/types/leave";
import { useAuth } from "@/context/auth-provider";


const TimeSheetFormPage = ({ params }: { params: { timeSheetId: string } }) => {

    const [data, setData] = useState(null);

    const [isLoading, setLoading] = useState(false)

    const [leaveType, setLeaveType] = useState<LeaveType[]>([])

    const {user} = useAuth();

    useEffect(() => {
        (async () => {
            setLoading(true); 

            // if (params.timeSheetId != 'new') {
            //     const employees = await apiClient.get(`/leave-request/${params.timeSheetId}`);
            //     setData(employees.data)
            // }

            // const departments = await apiClient.get(`/leave/type/get-by-org/${user?.orgId}`);
            // setLeaveType(departments.data)

            setLoading(false);
        })()
    }, [params.timeSheetId])

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">

                {isLoading ? (
                    <div className="grid h-screen place-items-center">
                        <Loader className="animate-spin h-5 w-5 mr-3" />
                    </div>
                ) : (
                    <TimesheetForm
                        initialData={data}
                        leaveType={leaveType}
                    />)}
            </div>
        </div>)
}

export default TimeSheetFormPage;