"use client";

import { ComingSoonPage } from "@/components/common/coming-soon";
import { Separator } from "@/components/ui/separator";
import { SubHeading } from "@/components/ui/sub-heading";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Loader, SlashIcon } from "lucide-react";
import { EarningsForm } from "./earnings-form";
import { useAuth } from "@/context/auth-provider";
import { useEffect, useState } from "react";
import { ComponentType } from "@/types/payroll";
import apiClient from "@/lib/api/api-client";

const EarningsFormPage = ({
    params
}: {
    params: { earningsId: string }
}) => {

    const [data, setData] = useState(null);

    const [isLoading, setLoading] = useState(true)

    const [type, setType] = useState<ComponentType[]>([])

    const { user } = useAuth();

    useEffect(() => {
        (async () => {

            if (params.earningsId != 'new') {
                const employees = await apiClient.get(`/salary-component/${params.earningsId}`);
                setData(employees.data)
            }

            const departments = await apiClient.get(`/component-type/get-by-type/EARNING`);
            setType(departments.data)

            setLoading(false);
        })()
    }, [params.earningsId])


    return (
        <>
            {isLoading ? (
                <div className="grid h-screen place-items-center">
                    <Loader className="animate-spin h-5 w-5 mr-3" />
                </div>
            ) : (<EarningsForm initialData={data} types={type} />)}
        </>)
}

export default EarningsFormPage;