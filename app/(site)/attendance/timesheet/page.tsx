"use client";

import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimesheetPage from "./timesheet-page";

const OrgSettingsPage = () => {
  return (
    <>
      <div className="space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading title="📅 Timesheet" description="Your timesheet records" />
        </div>
        <Separator />
        {/* DRAFT, INITIATED, APPROVED, REJECTED */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="space-y-4"><TimesheetPage status={"INITIATED"} /></TabsContent>
          <TabsContent value="approved" className="space-y-4"><TimesheetPage status={"APPROVED"} /></TabsContent>
          <TabsContent value="rejected" className="space-y-4"><TimesheetPage status={"REJECTED"} /></TabsContent>
        </Tabs>
      </div>
    </>)
}

export default OrgSettingsPage; 