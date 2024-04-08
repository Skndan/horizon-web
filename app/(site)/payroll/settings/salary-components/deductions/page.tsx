"use client";

import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { DeductionClient } from "./client"; 
import { SalaryTemplateItem } from "@/types/payroll";
import apiClient from "@/lib/api/api-client";

const DeductionsPage = () => {

    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState<SalaryTemplateItem[]>([]) 
 
    useEffect(() => { 
        apiClient.get('/salary-component/deduction').then((res) => res.data)
            .then((data) => {
                setData(data)
                setLoading(false)
            });
    }, [])

    return (
        <>
            <div className="flex-col">
                <div className="flex-1">
                    {isLoading ?
                        (
                            <div className="grid h-screen place-items-center">
                                <Loader className="animate-spin h-5 w-5 mr-3" />
                            </div>
                        )
                        : (<DeductionClient data={data} />)}
                </div>
            </div>
        </>
    )
}

export default DeductionsPage;