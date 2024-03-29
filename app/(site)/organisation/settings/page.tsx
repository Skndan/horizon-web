"use client";

import { Separator } from "@/components/ui/separator";
import { OrganisationForm } from "./components/organisation-form";
import { SubHeading } from "@/components/ui/sub-heading";
import { useEffect, useState } from "react";
import { Address, Organisation } from "@/types/profile";
import apiClient from "@/lib/api/api-client";
import Image from "next/image"
import { AddressForm } from "./components/address-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Loader, Plus } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EmptyStateTable } from "@/components/common/empty-state-table";

export interface Artwork {
    artist: string
    art: string
}

// export const works: Artwork[] = [
//     {
//         artist: "Ornella Binni",
//         art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
//     },
//     {
//         artist: "Tom Byrom",
//         art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
//     },
//     {
//         artist: "Vladimir Malyavko",
//         art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
//     },
// ]

const OrgSettingsPage = () => {


    const [orgData, setOrgData] = useState(null)
    const [addressList, setAddressList] = useState<Address[]>([])
    const [address, setAddress] = useState<any>(null)

    const [isLoading, setLoading] = useState(true)

    const [isAddressOpen, setAddressOpen] = useState(false);


    async function loadAddress() {
        const orgId = localStorage.getItem('orgId');
        await apiClient.get(`/address/get-by-organisation/${orgId}`).then((res) => res.data)
            .then((data) => {
                setAddressList(data);
            });
    }

    useEffect(() => {
        const fetchData = async () => {
            const orgId = localStorage.getItem('orgId');
            setLoading(true);
            apiClient.get(`/organisation/${orgId}`).then((res) => res.data)
                .then((data) => {
                    setOrgData(data);
                });
            loadAddress();
            setLoading(false);
        };

        fetchData();
    }, [])

    return (
        <>
            <div className="space-y-6 lg:max-w-2xl">
                <SubHeading title="Organisation Profile" description="Manage your organisation profile here" />
                <Separator />
                {isLoading ?
                    <div className="grid h-screen place-items-center">
                        <Loader className="animate-spin h-5 w-5 mr-3" />
                    </div> : orgData && <OrganisationForm initialData={orgData} />}
                {/* <OrganisationForm initialData={orgData} /> */}
                <Separator />
                <div className="flex items-center justify-between">
                    <SubHeading title="Address" description="Manage your organisation address here" />

                    {!isAddressOpen && <Button onClick={() => {
                        setAddress(null);
                        setAddressOpen(true);
                    }}>
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>}

                </div>
                {!isAddressOpen && (addressList.length === 0 ?
                    <EmptyStateTable title={"No address found"} description={"Add your first address below"} action={"Add Address"} onClick={() => {
                        setAddress(null);
                        setAddressOpen(true);
                    }} /> :
                    <ScrollArea className="lg:max-w-2xl rounded-md border">
                        <div className="flex w-max space-x-4 p-4">
                            {addressList.map((address) => (
                                <Card key={address.id} className="w-[350px]">
                                    <CardHeader>
                                        <CardTitle className="text-xl">{address.label}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="w-[350px]">
                                        <p className="text-sm text-muted-foreground">{`${address.addressLine1}, ${address.addressLine2}, ${address.state}, ${address.city} - ${address.pincode}`}</p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        {address.isPrimary && <Badge>
                                            Billing Address
                                        </Badge>}

                                        <Button variant={"outline"} size={"icon"} onClick={() => {
                                            setAddress(address);
                                            setAddressOpen(true);
                                        }}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>)}

                {isAddressOpen && <AddressForm initialData={address} onClose={async () => {
                    setAddressOpen(false);
                    await loadAddress();
                }} />}
            </div>
        </>)
}

export default OrgSettingsPage;