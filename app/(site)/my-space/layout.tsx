"use client";

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./components/side-bar-nav"
import { Heading } from "@/components/ui/heading"
import { useUserStore } from "@/store/use-user-store"
import { useAuth } from "@/context/auth-provider";

const sidebarNavItems = [
    {
        title: "Activity",
        href: "/my-space",
    },
    {
        title: "Tasks",
        href: "/my-space/tasks",
    },
    {
        title: "Profile",
        href: "/my-space/profile",
    },
    {
        title: "Attendance",
        href: "/my-space/attendance",
    },
    {
        title: "Timesheet",
        href: "/my-space/timesheet",
    },
    {
        title: "Leave Request",
        href: "/my-space/leave-request",
    },
]

interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {

    const { user } = useAuth();
    
    return (
        <>
            <div className="p-8 pb-16">
                <Heading title={user?.username ?? ''} description={"Manage your account"} />
                <Separator className="my-6" />
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/6">
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    {/* lg:max-w-2xl */}
                    <div className="flex-1">{children}</div>
                </div>
            </div>
        </>
    )
}