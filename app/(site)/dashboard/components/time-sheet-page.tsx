import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimesheetManagerPage from "./time-sheet-manager";
import { SubHeading } from "@/components/ui/sub-heading";

const DashboardTimesheetPage = () => {
    return <div className="space-y-4">
        {/* <div className="flex items-center justify-between">
            <SubHeading title="Timesheet" description="Your timesheet records" />
        </div>
        <Separator /> */}
        {/* DRAFT, INITIATED, APPROVED, REJECTED */}
        <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="space-y-4"><TimesheetManagerPage status={"INITIATED"} /></TabsContent>
            <TabsContent value="approved" className="space-y-4"><TimesheetManagerPage status={"APPROVED"} /></TabsContent>
            <TabsContent value="rejected" className="space-y-4"><TimesheetManagerPage status={"REJECTED"} /></TabsContent>
        </Tabs>
    </div>


}

export default DashboardTimesheetPage;