
"use client"

import apiClient, { getAuthorizationHeader } from "@/lib/api/api-client";
import { Profile } from "@/types/profile";
import { Loader } from "lucide-react";

import { useEffect, useState } from "react";
import { TodayAttendanceClient } from "./client";
import { attendance } from "../data";



export const TodayAttendancePage = () => {


    const [data, setData] = useState<Profile[]>([])
    const [isLoading, setLoading] = useState(true)

    // useEffect(() => {
    //     setLoading(true)
    //     apiClient.get('/profile').then((res) => res.data)
    //         .then((data) => {
    //             setData(data.content)
    //             setLoading(false)
    //         });
    // }, [])


    return (
        <div className="flex-col">
            <div className="flex-1">
                {!isLoading ?
                    (
                        <div className="grid h-screen place-items-center">
                            <Loader className="animate-spin h-5 w-5 mr-3" />
                        </div>
                    )
                    : (<TodayAttendanceClient data={attendance} />)}
            </div>
        </div>)
}

export default TodayAttendancePage;