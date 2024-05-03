"use client"

import { Info, Pen, Pencil, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { calculationType, inWords } from "@/lib/utils/string-utils"
import { Label } from "@/components/ui/label";
import { SalaryTemplate } from "@/types/payroll";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubHeading } from "@/components/ui/sub-heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface SalaryCardProps {
    template: SalaryTemplate | null;
};

export const SalaryCard: React.FC<SalaryCardProps> = ({
    template,
}) => {

    function typeBuilder(type: string, value: string) {
        if (type === "FIXED_AMOUNT") {
            return `Fixed - ₹${value}`;
        } else {
            return `${value}${calculationType(type)}`;
        }
    }

    return (
        <>
            <TooltipProvider>
                <div className="flex-col">
                    <div className="flex-1">
                        <div className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-md font-medium">Annual CTC</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-bold ">
                                            ₹{template!.ctc.toLocaleString('en-IN')}
                                        </p>
                                        <Label className="text-muted-foreground">
                                            {inWords(template!.ctc.toString())}
                                        </Label>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-md font-medium">Monthly CTC</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-bold ">
                                            ₹{(template!.ctc / 12).toFixed().toLocaleString()}
                                        </p>
                                        <Label className="text-muted-foreground">
                                            {inWords((template!.ctc / 12).toFixed().toString())}
                                        </Label>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="flex items-center justify-between">
                                <SubHeading title="Salary Split-ups" />
                                <Link href={`/organisation/employee/${template?.profile.id}?tab=salary`}>
                                    <Button>
                                        <Pencil className="mr-2 h-4 w-4" /> Update
                                    </Button>
                                </Link>
                            </div>
                            <div className="rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Salary Components</TableHead>
                                            <TableHead>Monthly Amount</TableHead>
                                            <TableHead>Annual Amount</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {template?.earnings.map((item: any, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <Label className="text-sm">{item.componentName}</Label>
                                                        <Label className="text-muted-foreground pt-2">{item.calculationType !== "FIXED_AMOUNT" ? typeBuilder(item.calculationType, item.value) : ""}</Label>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        item.componentType.type === "EARNING" ?
                                                            <Label className="text-green-600">
                                                                +₹{item.monthly?.toFixed()}
                                                            </Label> :
                                                            <Label className="text-red-600">
                                                                -₹{item.monthly?.toFixed()}
                                                            </Label>
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        item.componentType.type === "EARNING" ?
                                                            <Label className="text-green-600">
                                                                +₹{item.yearly?.toFixed()}
                                                            </Label> :
                                                            <Label className="text-red-600">
                                                                -₹{item.yearly?.toFixed()}
                                                            </Label>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        <TableRow>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex flex-row gap-1">
                                                            <Label>Special Allowance</Label>
                                                            <Info className="h-4 w-4" />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="w-40">Special allowance is a residual component of salary that is left after allocations are made for all other components.</p>
                                                    </TooltipContent>
                                                </Tooltip>

                                            </TableCell>
                                            <TableCell>₹{(template!.fixed / 12).toFixed()}</TableCell>
                                            <TableCell>₹{template!.fixed.toFixed()}</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                        <TableRow className={"bg-muted"}>
                                            <TableCell>Cost to Company</TableCell>
                                            <TableCell>₹{(template!.ctc / 12).toFixed()}</TableCell>
                                            <TableCell>₹{template!.ctc.toFixed()}</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>

                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </TooltipProvider>
        </>
    )
}