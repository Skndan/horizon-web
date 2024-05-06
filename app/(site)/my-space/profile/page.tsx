"use client";

import { BasicCard } from "../components/basic-card";
import { SubHeading } from "@/components/ui/sub-heading";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { WorkCard } from "../components/work-card";
import { useAuth } from "@/context/auth-provider";

const OrgSettingsPage = () => {

    const {user} = useAuth();
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
                <SubHeading title="Basic Information" description="" />
                <BasicCard profile={data} />
                <SubHeading title="Work Information" description="" />
                <WorkCard profile={data} />
            </div>
        </>)
}

export default OrgSettingsPage;