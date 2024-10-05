"use client";

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./components/side-bar-nav"
import { Heading } from "@/components/ui/heading"
import { useUserStore } from "@/store/use-user-store"
import { useAuth } from "@/context/auth-provider";
import { SubHeading } from "@/components/ui/sub-heading";

const sidebarNavItems = [
    // {
    //     title: "Activity",
    //     href: "/my-space",
    //     badge: true,
    // },
    {
        title: "Profile",
        href: "/my-space/profile",
        badge: false,
    },
    {
        title: "My Team",
        href: "/my-space/team",
        badge: false,
    },
    // {
    //     title: "My Projects",
    //     href: "/my-space/project",
    //     badge: true,
    // },
    // {
    //     title: "My Tasks",
    //     href: "/my-space/tasks",
    //     badge: false,
    // },
    {
        title: "Timesheet",
        href: "/my-space/timesheet",
        badge: false,
    },
    {
        title: "Attendance",
        href: "/my-space/attendance",
        badge: false,
    },
    {
        title: "My Leave",
        href: "/my-space/leave-request",
        badge: false,
    },
]

interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {

    const { user } = useAuth();

    return (
        <>
            <div className="py-4 px-8 pb-16"> 
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