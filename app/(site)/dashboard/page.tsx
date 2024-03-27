"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlarmClock, AlarmClockMinus, AlarmClockOff, DoorOpen, MonitorCheck, Users } from "lucide-react";
import ActivityPage from "./components/activity";
import { ComingSoonPage } from "@/components/common/coming-soon";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "@/lib/api/api-client";
import { formatDate } from "@/lib/utils/time-utils";

export const OverviewPage = () => {


    const d = new Date();
    const [currentTime, setCurrentTime] = useState('');
    const [clockedIn, setClockedIn] = useState(false);
    const [lastCheckInTime, setLastCheckInTime] = useState("");



    useEffect(() => {

        const date = d.getHours() + 'h : ' + d.getMinutes() + 'm : ' + d.getSeconds() + 's';
        const timer = setInterval(() => {
            setCurrentTime(date);
        }, 1000);

        return () => clearInterval(timer);
    }, [currentTime]);

    useEffect(() => {
        const checkClock = async () => {
            try {
                const profileId = localStorage.getItem("profileId");
                await apiClient.get(`/time-sheet/get-clock/${profileId}`)
                    .then((res) => {
                        console.log(res.data);
                        console.log(res.status);

                        if (res.status === 200) {
                            if (res.data.status == "IN") {
                                // SET IN
                                setClockedIn(true);
                                toast.success('You have clocked in', { icon: '🤝' });
                            } else {
                                // SET OUT
                                setClockedIn(false);
                                toast.success('You have clocked out', { icon: '👋' });
                            }

                            setLastCheckInTime(res.data.createdAt);
                        }

                        if (res.status === 204) {
                            // SET IN
                            setClockedIn(false);
                        }
                    });
            } catch (error) {
                toast.error('Unable to punch your clock');
            } finally {

            }
        };

        checkClock();
    }, []);

    const onClockChanged = async () => {
        try {
            // http://localhost:8080/api/time-sheet/clock/31c852fe-64ab-427e-9694-503be730841e
            const profileId = localStorage.getItem("profileId");
            await apiClient.get(`/time-sheet/clock/${profileId}`).then((res) => {
                console.log(res.data);
                console.log(res.status);

                if (res.status === 200) {
                    if (res.data.status == "IN") {
                        // SET IN
                        setClockedIn(true);
                        toast.success('You have clocked in', { icon: '🤝' });
                    } else {
                        // SET OUT
                        setClockedIn(false);
                        toast.success('You have clocked out', { icon: '👋' });
                    }

                    setLastCheckInTime(res.data.createdAt);
                }

            });

        } catch (error) {
            toast.error('Unable to punch your clock');
        } finally {

        }
    };

    return (
        <>
            <div className="flex-col md:flex">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    </div>
                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="activity">
                                Activity
                            </TabsTrigger>
                            <TabsTrigger value="approvals">
                                Approvals
                            </TabsTrigger>
                            <TabsTrigger value="timesheets">
                                Timesheets
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-top justify-between space-y-0 pb-2">
                                        <CardTitle className="text-md font-medium">
                                            My Time
                                        </CardTitle>
                                        <Button className={`${clockedIn ? "bg-red-500" : "bg-emerald-500"}  `} onClick={onClockChanged}>
                                            {
                                                clockedIn ?
                                                    <AlarmClockOff className="mr-2 h-4 w-4" /> :
                                                    <AlarmClock className="mr-2 h-4 w-4" />
                                            }
                                            {` ${clockedIn ? "Check Out" : "Check In"} `}
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        {/* <AlarmClock /> */}
                                        {/* <AlarmClockOff /> */}
                                        <div className="flex flex-row items-bottom space-y-0">
                                            <div className={`text-2xl ${clockedIn ? "text-red-500" : "text-emerald-500"} font-bold`}>{currentTime}</div>
                                            {/* {
                                                !clockedIn ?
                                                    <AlarmClock className="ml-2 h-6 w-6 pt-1 text-green-500" /> :
                                                    <AlarmClockOff className="ml-2 h-6 w-6 pt-1 text-green-500" />
                                            } */}
                                        </div>

                                        {
                                            lastCheckInTime ? 
                                                <p className="text-sm text-muted-foreground pt-1">
                                                    Checked In: Today at {lastCheckInTime && formatDate(lastCheckInTime, "hh: mm a")}
                                                </p> :
                                                < p className="text-sm text-muted-foreground pt-1">
                                                    You havent logged in yet
                                                </p>
                                        }
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-md font-medium">
                                            Time Off Requests
                                        </CardTitle>
                                        <AlarmClockMinus />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">#1</div>
                                        <p className="text-sm text-muted-foreground">
                                            +180.1% from last month
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-md font-medium">Whos Out</CardTitle>
                                        <DoorOpen />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">#12</div>
                                        <p className="text-sm text-muted-foreground">
                                            +2 since last hour
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-md font-medium">
                                            Active Now
                                        </CardTitle>
                                        <MonitorCheck />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">#5</div>
                                        <p className="text-sm text-muted-foreground">
                                            +2 since last hour
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                <Card className="col-span-4">
                                    <CardHeader className="flex flex-row items-top justify-between">
                                        <CardTitle>Headcount</CardTitle>
                                        <div className="flex flex-col">
                                            <div className="flex flex-row items-center">
                                                <Users className="mr-2 h-6 w-6" />
                                                <div className="text-2xl font-bold">17</div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Total Employees
                                            </p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pl-2">
                                        <Overview />
                                    </CardContent>
                                </Card>
                                <Card className="col-span-3">
                                    <CardHeader>
                                        <CardTitle>Recent Activities</CardTitle>
                                        <CardDescription>
                                            You have 5 pending requests for approvals.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RecentActivities />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="activity" className="space-y-4"><ActivityPage /></TabsContent>
                        <TabsContent value="approvals" className="space-y-4"><ComingSoonPage /></TabsContent>
                        <TabsContent value="timesheets" className="space-y-4"><ComingSoonPage /></TabsContent>
                    </Tabs>
                </div>
            </div >
        </>
    );
};

export default OverviewPage;
