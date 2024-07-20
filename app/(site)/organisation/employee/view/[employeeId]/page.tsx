"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { SubHeading } from "@/components/ui/sub-heading";
import { BasicCard } from "@/app/(site)/my-space/components/basic-card";
import { WorkCard } from "@/app/(site)/my-space/components/work-card";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Pencil, SlashIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AccountCard } from "./component/account-view";
import { Heading } from "@/components/ui/heading";
import { Profile } from "@/types/profile";
import { FileCard } from "./component/file-view";
import { SalaryTemplate } from "@/types/payroll";
import { SalaryCard } from "./component/salary-view";
import toast from "react-hot-toast";

const EmployeeDetailPage = ({ params }: { params: { employeeId: string } }) => {

    const [data, setData] = useState<Profile | null>(null)
    const [isLoading, setLoading] = useState(false)
    const [accounts, setAccounts] = useState(null)
    const searchParams = useSearchParams()
    const [template, setTemplate] = useState<SalaryTemplate | null>(null);

    useEffect(() => {

        (async () => {
            setLoading(true)
            await apiClient.get(`/profile/${params.employeeId}`).then((res) => res.data)
                .then((data) => {
                    setData(data)
                });

            //get if the salary template is associated 
            await apiClient.get(`/profile-salary-template/get-by-profile/${params.employeeId}`).then((res) => res.data)
                .then((data) => {
                    setTemplate(data)
                    // setEarnings(data.earnings)
                    setLoading(false)
                }).catch(async (error) => {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        if (error.response.status === 400) {
                            toast.error("Profile salary is not found");

                            await apiClient.get(`/profile-salary-template/get-by-profile/${params.employeeId}`).then((res) => res.data)
                                .then((data) => {
                                    setTemplate(data)
                                    // form.setValue("ctc", data.ctc);
                                    // setEarnings(data.earnings)
                                    setLoading(false)
                                });
                            // Inform the user about the bad request
                            // alert('Bad request. Please check your input.');
                        } else {
                            // For other errors, log the error message
;
                        }
                    } else {
                        // The request was made but no response was received
;
                    }
                });

            await apiClient.get(`/account/get-by-profile/${params.employeeId}`).
                then((res) => res.data)
                .then((data) => {
                    setAccounts(data)
                    setLoading(false)
                }).catch(error => {
                    // Handle errors
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        if (error.response.status === 400) {
;
                            // Inform the user about the bad request
                            // alert('Bad request. Please check your input.');
                            setLoading(false)
                        } else {
                            // For other errors, log the error message
;
                        }
                    } else {
                        // The request was made but no response was received
;
                    }
                })
        })()
    }, [])


    return (
        <>
            <div className="space-y-6 p-8">
                <Tabs defaultValue="info" className="space-y-4">
                    <div className="items-center justify-between py-2 md:flex block:flex-col">
                        <Heading title={`${data?.name ?? '-'}`} description={`${data?.email ?? '-'}`} />
                        <TabsList>
                            <TabsTrigger value="info">Info</TabsTrigger>
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="salary">Salary</TabsTrigger>
                            <TabsTrigger value="file">Files</TabsTrigger>
                        </TabsList>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`${searchParams.get('redirect')}`}>Back</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <SlashIcon />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Employee Details</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <TabsContent value="info" className="space-y-4">
                        <>
                            <div className="flex items-center justify-between">
                                <SubHeading title="Basic Information" description="" />
                                <Link href={`/organisation/employee/${params.employeeId}?tab=info`}>
                                    <Button>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                </Link>
                            </div>
                            <BasicCard profile={data} />
                            <SubHeading title="Work Information" description="" />
                            <WorkCard profile={data} />
                        </>
                    </TabsContent>
                    <TabsContent value="account" className="space-y-4">
                        <>
                            <div className="flex items-center justify-between">
                                <SubHeading title="Account Information" description="" />
                                <Link href={`/organisation/employee/${params.employeeId}?tab=account`}>
                                    <Button>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                </Link>
                            </div>
                            <AccountCard account={accounts} />
                        </>
                    </TabsContent>
                    <TabsContent value="file" className="space-y-4"><FileCard profile={data} /></TabsContent>
                    <TabsContent value="salary" className="space-y-4">
                        <SalaryCard
                            template={template}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </>)
}

export default EmployeeDetailPage;