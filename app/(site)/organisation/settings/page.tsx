"use client";

import { Separator } from "@/components/ui/separator";
import { OrganisationForm } from "./components/organisation-form";
import { SubHeading } from "@/components/ui/sub-heading";
import { useEffect, useState } from "react";
import { Organisation } from "@/types/profile";
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
import { Edit, Plus } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";



export interface Artwork {
    artist: string
    art: string
}

export const works: Artwork[] = [
    {
        artist: "Ornella Binni",
        art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "Tom Byrom",
        art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "Vladimir Malyavko",
        art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
    },
]

export const OrgSettingsPage = () => {


    const [data, setData] = useState<Organisation[]>([])
    const [isLoading, setLoading] = useState(false)

    const [isAddressOpen, setAddressOpen] = useState(false);

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
            <div className="space-y-6 lg:max-w-2xl">
                <SubHeading title="Organisation Profile" description="Manage your organisation profile here" />
                <Separator />
                <OrganisationForm />
                <Separator />
                <div className="flex items-center justify-between">
                    <SubHeading title="Address" description="Manage your organisation address here" />

                    {!isAddressOpen && <Button onClick={() => {
                        setAddressOpen(true); 
                    }}>
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>}

                </div>
                {!isAddressOpen && <ScrollArea className="lg:max-w-2xl rounded-md border">
                    <div className="flex w-max space-x-4 p-4">
                        {works.map((artwork) => (
                            <Card key={artwork.artist} className="w-[350px]">
                                <CardHeader>
                                    <CardTitle className="text-xl">HO</CardTitle>
                                </CardHeader>
                                <CardContent className="w-[350px]">
                                    <p className="text-sm text-muted-foreground">15 R, Pennaiyar Road, Manjakuppam, Cuddalore - 607001</p>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Badge>
                                        Billing Address
                                    </Badge>
                                    <Button variant={"outline"} size={"icon"}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>}
                {isAddressOpen && <AddressForm onClose={() => {
                    setAddressOpen(false);
                }} />}
            </div>
        </>)
}

export default OrgSettingsPage;