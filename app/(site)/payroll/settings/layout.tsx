import { Separator } from "@/components/ui/separator"  
import { Heading } from "@/components/ui/heading"  
import { SidebarNav } from "@/components/common/side-bar-nav"

const sidebarNavItems = [
    {
        title: "Pay Schedule",
        href: "/payroll/settings",
    },
    {
        title: "Salary Components",
        href: "/payroll/settings/salary-components",
    },
    {
        title: "Salary Templates",
        href: "/payroll/settings/salary-templates",
    },   
    {
        title: "Component Types",
        href: "/payroll/settings/component-types",
    }
]

interface PayrollSettingsLayoutProps {
    children: React.ReactNode
}

export default function PayrollSettingsLayout({ children }: PayrollSettingsLayoutProps) {
    return (
        <>
            <div className="p-8 pb-16">
                <Heading title={"Payroll Settings ✨"} description={"Manage your payroll and salary preferences."} />
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