"use client";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
import { mails } from "./data";
import { MailDisplay } from "./mail-display";
import { useMail } from "@/store/use-mail-store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ComingSoonPage } from "@/components/common/coming-soon";
export const ActivityPage = () => { 

    return (
        <TooltipProvider delayDuration={0}>
            <div className="flex flex-row">
                <Tabs defaultValue="all" className="flex-2 lg:w-1/2" >
                    <div className="flex items-center justify-between py-2">
                        <TabsList>
                            <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">All</TabsTrigger>
                            <TabsTrigger value="activities" className="text-zinc-600 dark:text-zinc-200">Activities</TabsTrigger>
                            <TabsTrigger value="events" className="text-zinc-600 dark:text-zinc-200">Events</TabsTrigger> 
                        </TabsList>
                        <Button>
                            ✨ Post something
                        </Button>
                    </div>
                    <Separator />
                    <div className="bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search" className="pl-8" />
                            </div>
                        </form>
                    </div>
                    <TabsContent value="all" className="m-0"><MailList items={mails} /></TabsContent>
                    <TabsContent value="activities" className="m-0"><ComingSoonPage /></TabsContent>
                    <TabsContent value="events" className="m-0"><ComingSoonPage /></TabsContent> 
                </Tabs>
            </div>
        </TooltipProvider>
    )
}

export default ActivityPage;
