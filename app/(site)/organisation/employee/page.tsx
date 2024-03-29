
"use client"
import { EmployeeClient } from "./components/client";
import apiClient, { getAuthorizationHeader } from "@/lib/api/api-client";
import { Profile } from "@/types/profile";
import { Loader } from "lucide-react";

import { useEffect, useState } from "react";

const DirectoryPage = () => { 
    
    const [data, setData] = useState<Profile[]>([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        apiClient.get('/profile').then((res) => res.data)
            .then((data) => {
                setData(data.content)
                setLoading(false)
            });
    }, [])


    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                {isLoading ?
                    (
                        <div className="grid h-screen place-items-center">
                            <Loader className="animate-spin h-5 w-5 mr-3" />
                        </div>
                    )
                    : (<EmployeeClient data={data} />)}
            </div>
        </div>)
}

export default DirectoryPage;