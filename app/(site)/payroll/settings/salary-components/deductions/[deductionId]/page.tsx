"use client";

import { Loader } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { useEffect, useState } from "react";
import { ComponentType, SalaryComponent } from "@/types/payroll";
import apiClient from "@/lib/api/api-client";
import { DeductionForm } from "./deductions-form";

const DeductionsFormPage = ({
    params
}: {
    params: { deductionId: string }
}) => {

    const [data, setData] = useState(null);

    const [isLoading, setLoading] = useState(true)

    const [type, setType] = useState<ComponentType[]>([])
    const [component, setComponent] = useState<SalaryComponent[]>([])

    const { user } = useAuth();

    useEffect(() => {
        (async () => {

            if (params.deductionId != 'new') {
                const employees = await apiClient.get(`/salary-component/${params.deductionId}`);
                setData(employees.data)
            }

            const departments = await apiClient.get(`/component-type/get-by-type/DEDUCTION`);
            setType(departments.data)

            const salaryComponents = await apiClient.get(`/salary-component/deduction`);
            setComponent(salaryComponents.data)

            setLoading(false);
        })()
    }, [params.deductionId])


    return (
        <>
            {isLoading ? (
                <div className="grid h-screen place-items-center">
                    <Loader className="animate-spin h-5 w-5 mr-3" />
                </div>
            ) : (<DeductionForm initialData={data} types={type} components={component} />)}
        </>)
}

export default DeductionsFormPage;