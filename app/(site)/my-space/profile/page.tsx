"use client";

import { BasicCard } from "../components/basic-card";
import { SubHeading } from "@/components/ui/sub-heading";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { WorkCard } from "../components/work-card";
import { useAuth } from "@/context/auth-provider";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const OrgSettingsPage = () => {

    const { user } = useAuth();
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        apiClient.get(`/profile/${user?.profileId}`).then((res) => res.data)
            .then((data) => {
                setData(data)
                setLoading(false)
            });
    }, [])


    return (
        <>
            <div className="space-y-6">
                <Heading title={`Hi, ${user?.username ?? ''}`} description={"Manage your account"} />
                <Separator className="my-6" />


                <div className="flex items-center justify-between">
                    <SubHeading title="Basic Information" description="" />
                    <Link href={`#`}>
                        <Button disabled>
                            <Plus className="mr-2 h-4 w-4" /> Change request
                        </Button>
                    </Link>
                </div>


                <BasicCard profile={data} />
                <SubHeading title="Work Information" description="" />
                <WorkCard profile={data} />
            </div>
        </>)
}

export default OrgSettingsPage;