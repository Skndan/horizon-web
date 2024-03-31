
"use client"

import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { TodayAttendanceClient } from "./client";
import { Daylog } from "@/types/attendance";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/lib/utils/time-utils";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth-provider";

const TodayAttendancePage = () => {

    const [data, setData] = useState<Daylog[]>([])
    const [isLoading, setLoading] = useState(true)
    const { user } = useAuth();


    const [date, setDate] = useState<Date | undefined>(new Date())


    useEffect(() => {
        const onLoad = async () => {
            try {
                await apiClient.get(`/time-sheet/day-log-by-organisation/day-wise/${user?.orgId}/${formatDate(date!.toISOString(), "yyyy-MM-dd")}`).then((res) => res.data)
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