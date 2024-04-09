"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { TimesheetForm } from "./timesheet-form";
import { LeaveType } from "@/types/leave";
import { useAuth } from "@/context/auth-provider";
import { Timesheet } from "@/types/attendance";


const TimeSheetFormPage = ({ params }: { params: { timesheetId: string } }) => {

    const [data, setData] = useState(null);

    const [isLoading, setLoading] = useState(true) 

    const {user} = useAuth();

    useEffect(() => {
        (async () => {
            setLoading(true); 

            if (params.timesheetId != 'new') {
                const employees = await apiClient.get(`/time-sheet/${params.timesheetId}`);
                setData(employees.data)
            }

            setLoading(false);
        })()
    }, [params.timesheetId])

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4">

                {isLoading ? (
                    <div className="grid h-screen place-items-center">
                        <Loader className="animate-spin h-5 w-5 mr-3" />
                    </div>
                ) : (
                    <TimesheetForm
                        initialData={data} 
                    />)}
            </div>
        </div>)
}

export default TimeSheetFormPage;