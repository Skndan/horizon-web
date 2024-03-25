"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react"; 
import { ShiftForm } from "./shift-form";


const OnboardingPage = ({ params }: { params: { shiftId: string } }) => {

    const [data, setData] = useState(null);
    const [org, setOrg] = useState(null);
 
    const [isLoading, setLoading] = useState(false)
 
    useEffect(() => {
        (async () => {
            setLoading(true);

            if (params.shiftId != 'new') {
                const employees = await apiClient.get(`/shift/${params.shiftId}`);
                setData(employees.data)
            } 
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
                    <ShiftForm 
                        initialData={data}
                    />)}
            </div>
        </div>)
}

export default OnboardingPage;