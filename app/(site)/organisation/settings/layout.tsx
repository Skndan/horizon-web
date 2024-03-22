import { Separator } from "@/components/ui/separator"  
import { Heading } from "@/components/ui/heading" 
import { SidebarNav } from "@/components/common/side-bar-nav"

const sidebarNavItems = [
    {
        title: "Organisation",
        href: "/organisation/settings",
    },
    {
        title: "Account",
        href: "/organisation/settings/accounts",
    },
    {
        title: "Payroll",
        href: "/organisation/settings/payroll",
    },
    {
        title: "Notifications",
        href: "/organisation/settings/notifications",
    },
    {
        title: "Holiday",
        href: "/organisation/settings/holiday",
    },
    {
        title: "Reports",
        href: "/organisation/settings/reports",
    },
]

interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <>
            <div className="p-8 pb-16">
                <Heading title={"Organisation Settings 📑"} description={"Manage your account settings and set e-mail preferences."} />
                <Separator className="my-6" />
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/6">
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <div className="flex-1">{children}</div>
                </div> 
            </div>
        </>
    )
}