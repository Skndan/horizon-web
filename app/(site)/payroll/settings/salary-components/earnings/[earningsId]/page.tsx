"use client";

import { ComingSoonPage } from "@/components/common/coming-soon";
import { Separator } from "@/components/ui/separator";
import { SubHeading } from "@/components/ui/sub-heading";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SlashIcon } from "lucide-react";
import { EarningsForm } from "./earnings-form";

const EarningsFormPage = ({
    params
}: {
    params: { earningsId: string }
}) => {
    return (
        <>
            <div className="space-y-6 lg:max-w-2xl">
                <div className="flex items-center justify-between">
                    <SubHeading title="Add Earnings" description="Manage your organisation profile here" />
                    <Breadcrumb className="sm:block hidden">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/payroll/settings/salary-components">Earnings</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <SlashIcon />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbPage>Form</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <Separator />
                <EarningsForm /> 
            </div>
        </>)
}

export default EarningsFormPage;