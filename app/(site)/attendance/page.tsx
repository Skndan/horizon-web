import { ComingSoonPage } from "@/components/common/coming-soon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TodayAttendancePage from "./today-attendance/today-attendance";
import AttendanceTable from "./components/attendance-table";

export const AttendancePage = () => {
    return (
        <>
            <div className="flex-col md:flex">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
                    </div>
                    <Tabs defaultValue="today" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="today">Today</TabsTrigger>
                            <TabsTrigger value="activity">Monthly</TabsTrigger>
                            <TabsTrigger value="approvals">Leave Request</TabsTrigger> 
                        </TabsList>
                        <TabsContent value="today" className="space-y-4"><TodayAttendancePage /></TabsContent>
                        <TabsContent value="activity" className="space-y-4"><AttendanceTable /></TabsContent>
                        <TabsContent value="approvals" className="space-y-4"><ComingSoonPage /></TabsContent>
                    </Tabs>
                </div>
            </div>
        </>)
}

export default AttendancePage;