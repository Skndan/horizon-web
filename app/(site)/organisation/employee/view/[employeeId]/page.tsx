"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { useAuth } from "@/context/auth-provider";
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
} from "@/components/ui/breadcrumb"
import { Pencil, SlashIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ComingSoonPage } from "@/components/common/coming-soon";
import { AccountCard } from "./component/account-view";
import { Heading } from "@/components/ui/heading";
import { Profile } from "@/types/profile";
import { FileCard } from "./component/file-view";

const EmployeeDetailPage = ({ params }: { params: { employeeId: string } }) => {

    const [data, setData] = useState<Profile | null>(null)
    const [isLoading, setLoading] = useState(false)
    const [accounts, setAccounts] = useState(null)

    const searchParams = useSearchParams()

    useEffect(() => {
        setLoading(true)
        apiClient.get(`/profile/${params.employeeId}`).then((res) => res.data)
            .then((data) => {
                setData(data)
                setLoading(false)
            });

        apiClient.get(`/account/get-by-profile/${params.employeeId}`).
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
                        console.log('Bad request:', error.response.data);
                        // Inform the user about the bad request
                        // alert('Bad request. Please check your input.');
                    } else {
                        // For other errors, log the error message
                        console.log('Error:', error.message);
                    }
                } else {
                    // The request was made but no response was received
                    console.log('Error:', error.message);
                }
            })
    }, [])


    return (
        <>
            <div className="space-y-6 p-8">

                <Tabs defaultValue="info" className="space-y-4">
                    <div className="items-center justify-between py-2 md:flex block:flex-col">
                        <Heading title={`${data?.name ?? '-'}`} description={`${data?.email ?? '-'}`} />
                        <TabsList>
                            <TabsTrigger value="info">Information</TabsTrigger>
                            <TabsTrigger value="account">Account</TabsTrigger>
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
                </Tabs>
            </div>
        </>)
}

export default EmployeeDetailPage;