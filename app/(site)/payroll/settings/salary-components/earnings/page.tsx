"use client";

import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { EarningClient } from "./client"; 
import { SalaryTemplateItem } from "@/types/payroll";
import apiClient from "@/lib/api/api-client";

const EarningsPage = () => {


    const [data, setData] = useState<SalaryTemplateItem[]>([])
    const [isLoading, setLoading] = useState(true)
 
    useEffect(() => { 
        apiClient.get('/salary-component/earning').then((res) => res.data)
            .then((data) => {
                setData(data)
                setLoading(false)
            });
    }, [])

    return (
        <><div className="flex-col">
            <div className="flex-1">
                {isLoading ?
                    (
                        <div className="grid h-screen place-items-center">
                            <Loader className="animate-spin h-5 w-5 mr-3" />
                        </div>
                    )
                    : (<EarningClient data={data} />)}
            </div>
        </div>
        </>)
}

export default EarningsPage;