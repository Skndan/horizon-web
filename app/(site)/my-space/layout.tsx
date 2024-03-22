import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./components/side-bar-nav"
import { Heading } from "@/components/ui/heading"

const sidebarNavItems = [
    {
        title: "Activity",
        href: "/my-space",
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
        title: "Leave Tracker",
        href: "/my-space/leave-tracker",
    },
]

interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <>
            <div className="p-8 pb-16">
                <Heading title={"{Username}"} description={"Manage your account"} />
                <Separator className="my-6" />
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/6">
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <div className="flex-1 lg:max-w-2xl">{children}</div>
                </div>
            </div>
        </>
    )
}