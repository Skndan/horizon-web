"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { SalaryTemplateClient } from "./client";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { SalaryTemplate } from "@/types/payroll";

const TemplatePage = () => {


    const [data, setData] = useState<SalaryTemplate[]>([])
    const [isLoading, setLoading] = useState(true)

    const { user } = useAuth();

    useEffect(() => {
        apiClient.get(`/salary-template/get-by-org/${user?.orgId}`).then((res) => res.data)
            .then((data) => {
                setData(data.content)
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
                    : (<SalaryTemplateClient data={[]} />)}
            </div>
        </div>
        </>)
}

export default TemplatePage;