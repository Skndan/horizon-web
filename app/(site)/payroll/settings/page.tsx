"use client";

import { Separator } from "@/components/ui/separator";
import { SubHeading } from "@/components/ui/sub-heading";
import { PayScheduleForm } from "./_components/pay-schedule-form";
import apiClient from "@/lib/api/api-client";
import { useState, useEffect } from "react";
import { PaySchedule } from "@/types/payroll";
import { useAuth } from "@/context/auth-provider";
import { Loader } from "lucide-react";

const PaySchedulePage = () => {

    const [data, setData] = useState<PaySchedule | null>(null)
    const [loading, setLoading] = useState(true)
    const { user } = useAuth();

    useEffect(() => {
        apiClient.get(`/pay-schedule/get-by-org/${user?.orgId}`)
            .then((res) => {
                if (res.status === 200) {
                    setData(res.data)
                }
                setLoading(false)
            });
    }, [])

    return (
        <>
            <div className="space-y-6 lg:max-w-2xl">
                <SubHeading title="Pay Schedule" description="Organisation Payroll Schedule" />
                <Separator />


                {loading ?
                    (
                        <div className="grid h-screen place-items-center">
                            <Loader className="animate-spin h-5 w-5 mr-3" />
                        </div>
                    )
                    : (<PayScheduleForm initialData={data} />)}


            </div>
        </>)
}

export default PaySchedulePage;