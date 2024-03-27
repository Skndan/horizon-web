
"use client"

import apiClient, { getAuthorizationHeader } from "@/lib/api/api-client";
import { Loader } from "lucide-react";

import { useEffect, useState } from "react";
import { TodayAttendanceClient } from "./client";
import { Daylog } from "@/types/attendance";
import { format, getDaysInMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/lib/utils/time-utils";
import toast from "react-hot-toast";

export const TodayAttendancePage = () => {

    const [data, setData] = useState<Daylog[]>([])
    const [isLoading, setLoading] = useState(true)



    const [date, setDate] = useState<Date | undefined>(new Date())


    useEffect(() => {
        const onLoad = async () => {
            try {
                const orgId = localStorage.getItem("orgId");
                await apiClient.get(`/time-sheet/day-log-by-organisation/day-wise/${orgId}/${formatDate(date!.toISOString(), "yyyy-MM-dd")}`).then((res) => res.data)
                    .then((data) => {
                        setData(data)
                        setLoading(false)
                    });
            } catch (error) {
                toast.error('');
            } finally {

            }
        }; 
        onLoad();
    }, [date])

    return (
        <div className="flex-col">
            <div className="flex-1">
                {isLoading ?
                    (
                        <div className="grid h-screen place-items-center">
                            <Loader className="animate-spin h-5 w-5 mr-3" />
                        </div>
                    )
                    : (<>
                        <div className='flex flex-row gap-4'>
                            <div className="flex-1">
                                <TodayAttendanceClient data={data} />
                            </div>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                            />
                        </div>
                    </>)}
            </div>
        </div>)
}

export default TodayAttendancePage;