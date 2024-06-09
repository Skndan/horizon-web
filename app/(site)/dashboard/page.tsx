"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlarmClock, AlarmClockMinus, AlarmClockOff, Plus, Terminal, Users } from "lucide-react";
import ActivityPage from "./components/activity";
import { ComingSoonPage } from "@/components/common/coming-soon";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "@/lib/api/api-client";
import { formatDate } from "@/lib/utils/time-utils";
import { useAuth } from "@/context/auth-provider";
import Overview from "@/components/dashboard/overview";
import { DashboardData } from "@/types/dashboard";
import DashboardTimesheetPage from "./components/time-sheet-page";
import WhosOutCard from "./components/whos-out-card";
import ActiveNowCard from "./components/active-now-card";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Label } from "@/components/ui/label";
import Link from "next/link";

const OverviewPage = () => {

    const [currentTime, setCurrentTime] = useState('');
    const [clockedIn, setClockedIn] = useState(false);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [lastCheckInTime, setLastCheckInTime] = useState("");
    const { user, loading: isLoading } = useAuth();

    useEffect(() => {
        const d = new Date();
        const date = d.getHours() + 'h : ' + d.getMinutes() + 'm : ' + d.getSeconds() + 's';
        const timer = setInterval(() => {
            setCurrentTime(date);
        }, 1000);

        return () => clearInterval(timer);
    }, [currentTime]);

    useEffect(() => {
        const checkClock = async () => {
            try {
                await apiClient.get(`/time-sheet/get-clock/${user?.profileId}`)
                    .then((res) => {
                        if (res.status === 200) {
                            if (res.data.status == "IN") {
                                // SET IN
                                setClockedIn(true);
                                toast.success('You have logged in', { icon: '🤝' });
                            } else {
                                // SET OUT
                                setClockedIn(false);
                                toast.success('You have logged out', { icon: '👋' });
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

        const getDashboard = async () => {
            try {
                console.log(user);
                await apiClient.get(`/dashboard/get-by-org/${user?.orgId}`)
                    .then((res) => {
                        setDashboardData(res.data);
                    });
            } catch (error) {
                toast.error('Unable to punch your clock');
            } finally {

            }
        };

        if (!isLoading) {
            checkClock();
            getDashboard();
        }
    }, []);

    const onClockChanged = async () => {
        try {
            await apiClient.get(`/time-sheet/clock/${user?.profileId}`).then((res) => {

                if (res.status === 200) {
                    if (res.data.status == "IN") {
                        // SET IN
                        setClockedIn(true);
                        toast.success('You have logged in', { icon: '🤝' });
                    } else {
                        // SET OUT
                        setClockedIn(false);
                        toast.success('You have logged out', { icon: '👋' });
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
                    {dashboardData && <> 
                        {dashboardData.departmentCount === 0 && <div className="flex md:flex-row flex-col p-4 border rounded-md justify-between gap-4 border-destructive/50 dark:border-destructive">
                            <div className="flex flex-row">
                                <p>🏢</p>
                                <div className="flex flex-col ml-2">
                                    <p className={"mb-1 font-medium leading-none tracking-tight"}>{"Setup your Organisation's Department"}</p>
                                    <p className={"text-sm [&_p]:leading-relaxed text-muted-foreground"}>Create departments to organize your team. Add your first department now!</p>
                                </div>
                            </div>
                            <Link href={`/organisation/department`}>
                                <Button className="ml-8">
                                    <Plus className="mr-2 h-4 w-4" /> Add Department
                                </Button>
                            </Link>
                        </div>}
                        {dashboardData.shiftCount === 0 && <div className="flex md:flex-row flex-col p-4 border rounded-md justify-between gap-4 border-destructive/50 dark:border-destructive">
                            <div className="flex flex-row">
                                <p>⏰</p>
                                <div className="flex flex-col ml-2">
                                    <p className={"mb-1 font-medium leading-none tracking-tight"}>{"Setup your Shifts"}</p>
                                    <p className={"text-sm [&_p]:leading-relaxed text-muted-foreground"}>Define work shifts to keep your team organized. Add your first shift now!</p>
                                </div>
                            </div>
                            <Link href={`/attendance/shifts/new`}>
                                <Button className="ml-8">
                                    <Plus className="mr-2 h-4 w-4" /> Add Shift
                                </Button>
                            </Link>
                        </div>}
                        {dashboardData.officeCount === 0 && <div className="flex md:flex-row flex-col p-4 border rounded-md justify-between gap-4 border-destructive/50 dark:border-destructive">
                            <div className="flex flex-row">
                                <p>📍</p>
                                <div className="flex flex-col ml-2">
                                    <p className={"mb-1 font-medium leading-none tracking-tight"}>{"Setup your Office Locations"}</p>
                                    <p className={"text-sm [&_p]:leading-relaxed text-muted-foreground"}>Complete your profile by adding your business address. Add your address now!</p>
                                </div>
                            </div>
                            <Link href={`/organisation/location/new`}>
                                <Button className="ml-8">
                                    <Plus className="mr-2 h-4 w-4" /> Add Address
                                </Button>
                            </Link>
                        </div>}
                        {dashboardData.leaveTypeCount === 0 && <div className="flex md:flex-row flex-col p-4 border rounded-md justify-between gap-4 border-destructive/50 dark:border-destructive">
                            <div className="flex flex-row">
                                <p>🏖️</p>
                                <div className="flex flex-col ml-2">
                                    <p className={"mb-1 font-medium leading-none tracking-tight"}>{"Setup Your Leave Types"}</p>
                                    <p className={"text-sm [&_p]:leading-relaxed text-muted-foreground"}>Add your leave types and quotas now to streamline time-off management!</p>
                                </div>
                            </div>
                            <Link href={`/organisation/settings/leave`}>
                                <Button className="ml-8">
                                    <Plus className="mr-2 h-4 w-4" /> Add Leave Types
                                </Button>
                            </Link>
                        </div>}
                    </>}
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    </div>
                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="activity">
                                Invites
                            </TabsTrigger>
                            <TabsTrigger value="approvals">
                                Approvals
                                <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">Coming Soon🔥</span>
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
                                            {` ${clockedIn ? "Logged Out" : "Logged In"} `}
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
                                <Card className="hover:bg-muted hover:cursor-pointer">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-md font-medium">
                                            Leave Requests
                                        </CardTitle>
                                        <AlarmClockMinus />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">#{dashboardData?.leaveRequestCount}</div>
                                        <p className="text-sm text-muted-foreground">
                                            +180.1% from last month
                                        </p>
                                    </CardContent>
                                </Card>
                                <WhosOutCard inBreakList={dashboardData?.inBreakCount ?? []} />
                                <ActiveNowCard activeList={dashboardData?.activeCount ?? []} />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                <Card className="col-span-4">
                                    <CardHeader className="flex flex-row items-top justify-between">
                                        <CardTitle>Headcount</CardTitle>
                                        <div className="flex flex-col">
                                            <div className="flex flex-row items-center">
                                                <Users className="mr-2 h-6 w-6" />
                                                <div className="text-2xl font-bold">{dashboardData?.totalHeadCount}</div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Total Employees
                                            </p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pl-2">
                                        <Overview data={dashboardData?.monthwiseHeadCount ?? []} />
                                    </CardContent>
                                </Card>
                                <Card className="col-span-3">
                                    <CardHeader>
                                        <CardTitle>
                                            Recent Activities
                                            <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">Coming Soon🔥</span>
                                        </CardTitle>
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
                        <TabsContent value="timesheets" className="space-y-4"><DashboardTimesheetPage /></TabsContent>
                    </Tabs>
                </div>
            </div >
        </>
    );
};

export default OverviewPage; 