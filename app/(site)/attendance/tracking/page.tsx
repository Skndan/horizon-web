import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TodayAttendancePage from "./_today-attendance/today-attendance";
import { MonthlyAttendancePage } from "./_monthy-attendance/monthly-attendance";

export const AttendancePage = () => {
    return (
        <>
            <div className="flex-col md:flex">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Attendance Tracking</h2>
                    </div>
                    <Tabs defaultValue="today" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="today">Today</TabsTrigger>
                            <TabsTrigger value="activity">Monthly</TabsTrigger>
                            {/* <TabsTrigger value="shift_calendar">Shifts Calendar</TabsTrigger>  */}
                        </TabsList>
                        <TabsContent value="today" className="space-y-4"><TodayAttendancePage /></TabsContent>
                        <TabsContent value="activity" className="space-y-4"><MonthlyAttendancePage /></TabsContent>
                        {/* <TabsContent value="shift_calendar" className="space-y-4"><ShiftSchedule /></TabsContent>  */}
                    </Tabs>
                </div>
            </div>
        </>)
}

export default AttendancePage;