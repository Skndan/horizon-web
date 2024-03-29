"use client";

import { ComingSoonPage } from "@/components/common/coming-soon";
import { Button } from "@/components/ui/button";
import { SubHeading } from "@/components/ui/sub-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EarningsPage from "./earnings/page";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast";
import { Banknote, Edit, Plus, SquarePercent } from "lucide-react";
import { useRouter } from "next/navigation";
import DeductionsPage from "./deductions/page";

const PayrollPage = () => {

    const router = useRouter();

    const handleMenuItemClick = (value: string) => {
        if (value == 'e') {
            router.push(`/payroll/settings/salary-components/earnings/new`)
        } else {
            router.push(`/payroll/settings/salary-components/deductions/new`)
        }
    };

    return (
        <>
            <div className="flex-col md:flex">
                <div className="flex-1 space-y-4  ">
                    <div className="flex items-center justify-between space-y-2">
                        <SubHeading title={"Salary Components"} />
                        <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" /> Add Components
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    alignOffset={-5}
                                    className="w-[200px]"
                                    forceMount
                                >
                                    <DropdownMenuItem onSelect={() => handleMenuItemClick("e")}><Banknote className="mr-2 h-4 w-4" />Earnings</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleMenuItemClick("d")}><SquarePercent className="mr-2 h-4 w-4" />Deductions</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <Tabs defaultValue="earnings" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="earnings">Earnings</TabsTrigger>
                            <TabsTrigger value="deductions">Deductions</TabsTrigger>
                        </TabsList>
                        <TabsContent value="earnings" className="space-y-4"><EarningsPage /></TabsContent>
                        <TabsContent value="deductions" className="space-y-4"><DeductionsPage /></TabsContent>
                    </Tabs>
                </div>
            </div>
        </>)
}

export default PayrollPage;