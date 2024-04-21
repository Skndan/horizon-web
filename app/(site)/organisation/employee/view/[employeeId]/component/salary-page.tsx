"use client"; 

import { Loader } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { useEffect, useState } from "react";
import { SalaryTemplateItem } from "@/types/payroll";
import apiClient from "@/lib/api/api-client";
import { TemplateForm } from "./template-form2";

const TemplateFormPage = ({}: {}) => {

    const [data, setData] = useState(null);

    const [isLoading, setLoading] = useState(true)

    const [earningType, setEarningType] = useState<SalaryTemplateItem[]>([])
    const [deductionType, setDeductionType] = useState<SalaryTemplateItem[]>([])

    const { user } = useAuth();

    useEffect(() => {
        (async () => {

            // if (params.templateId != 'new') {
            //     const employees = await apiClient.get(`/salary-template/${params.templateId}`);
            //     setData(employees.data)
            // } else {
            //     const employees = await apiClient.get(`/salary-template/get-draft/${user?.orgId}`);
            //     setData(employees.data)
            // }

            // const earning = await apiClient.get(`/component-type/get-by-type/EARNING`);
            // const deduction = await apiClient.get(`/component-type/get-by-type/DEDUCTION`);

            const earning = await apiClient.get(`/salary-component`); 

            const temp: SalaryTemplateItem[] = earning.data.content;
           
            
            const earningTemp = temp.filter(function(item){
                return item.componentType.type === "EARNING"
            })

            const deductionTemp = temp.filter(function(item){
                return item.componentType.type === "DEDUCTION"
            })
             
            setEarningType(earningTemp)
            setDeductionType(deductionTemp)

            setLoading(false);
        })()
    }, [])


    return (
        <>

            <div className="flex-col">
                <div className="flex-1">
                    {isLoading ? (
                        <div className="grid h-screen place-items-center">
                            <Loader className="animate-spin h-5 w-5 mr-3" />
                        </div>
                    ) : (
                        <TemplateForm
                            initialData={data}
                            earningType={earningType}
                            deductionType={deductionType} />
                    )}
                </div>
            </div> 
        </>)
}

export default TemplateFormPage;