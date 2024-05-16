"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdjustmentPage from "./adjustment-page";

const ManualClockInPage = () => {
 
    return (
        <>
            <div className="space-y-6 p-8">
                <div className="flex items-center justify-between">
                    <Heading title={`Login Time Adjustments`} description="Manage login time adjustment requests" />
                </div>
                <Separator />
                <Tabs defaultValue="pending" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending" className="space-y-4"><AdjustmentPage status={"INITIATED"} /></TabsContent>
                    <TabsContent value="approved" className="space-y-4"><AdjustmentPage status={"APPROVED"} /></TabsContent>
                    <TabsContent value="rejected" className="space-y-4"><AdjustmentPage status={"REJECTED"} /></TabsContent> 
                </Tabs>
            </div>
        </>)
}

export default ManualClockInPage; 