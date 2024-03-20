"use client";

import { Separator } from "@/components/ui/separator";
import { OrganisationForm } from "./components/organisation-form";
import { SubHeading } from "@/components/ui/sub-heading";
import { useEffect, useState } from "react";
import { Organisation } from "@/types/profile";
import apiClient from "@/lib/api/api-client";
import { AddressForm } from "./components/address-form";

export const OrgSettingsPage = () => {


    const [data, setData] = useState<Organisation[]>([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        apiClient.get('/profile').then((res) => res.data)
            .then((data) => {
                setData(data.content)
                setLoading(false)
            });
    }, [])


    return (
        <>
            <div className="space-y-6"> 
                <SubHeading title="Organisation Profile" description="Manage your organisation profile here" />
                <Separator /> 
                <OrganisationForm />
                <Separator /> 
                <SubHeading title="Address" description="Manage your organisation address here" /> 
                <AddressForm />
            </div>
        </>)
}

export default OrgSettingsPage;