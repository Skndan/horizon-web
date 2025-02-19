"use client";

import { Input } from "@/components/ui/input";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import {
    Search
} from "lucide-react"

import { MailList } from "./mail-list";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { Activity } from "@/types/activity";
import apiClient from "@/lib/api/api-client";
import { MailDisplay } from "./mail-display";
import { useMail } from "@/store/use-mail-store";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";

const ActivityPage = () => {


    const [data, setData] = useState<Activity[]>([])
    const [isLoading, setLoading] = useState(true)

    const {user} = useAuth();
    
    async function fetchData() {
        setLoading(true)
      
        await apiClient.get(`/activity/get-by-org/${user?.orgId}`).then((res) => res.data)
            .then(async (data) => {
                setData(data.content)
                await apiClient.get(`/activity/get-by-profile/${user?.profileId}`).then((res) => res.data)
                    .then((data) => {
                        setData(prev => prev.concat(...data))
                        setLoading(false)
                    });
            });
    }

    useEffect(() => {
        fetchData();
    }, [])

    const [mail, setMail] = useMail()

    const router = useRouter();

    return (
        <TooltipProvider delayDuration={0}>
            <div className="flex flex-row space-x-4">
                {/*  lg:w-1/2 */}
                <Tabs defaultValue="all" className="flex-2 lg:w-1/2" >
                    <div className="flex items-center justify-between py-2">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="activities">Activities</TabsTrigger>
                            <TabsTrigger value="events">Events</TabsTrigger>
                        </TabsList> 
                    </div> 
                    <div className="bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-foreground" />
                                <Input placeholder="Search" className="pl-8" />
                            </div>
                        </form>
                    </div>
                    <TabsContent value="all" className="m-0"><MailList items={data} /></TabsContent>
                    <TabsContent value="activities" className="m-0"><MailList items={data.filter((item) => item.type === "ACTIVITY")} /></TabsContent>
                    <TabsContent value="events" className="m-0"><MailList items={data.filter((item) => item.type === "EVENT")} /></TabsContent>
                </Tabs>
                <MailDisplay
                    mail={data.find((item) => item.id === mail.selected) || null}
                />
            </div>
        </TooltipProvider>
    )
}

export default ActivityPage;
