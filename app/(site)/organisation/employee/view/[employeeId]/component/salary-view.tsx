"use client"

import { Profile } from "@/types/profile"
import { Info, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useUpdateStore } from "@/store/use-update-store";
import apiClient from "@/lib/api/api-client";
import { useAuth } from "@/context/auth-provider";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import toast from "react-hot-toast";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SubHeading } from "@/components/ui/sub-heading";
import { Label } from "@/components/ui/label";
import { SalaryTemplate } from "@/types/payroll";
import { Input } from "@/components/ui/input";
import { inWords } from "@/lib/utils/string-utils";

interface SalaryCardProps {
    profile: Profile;
};

const formSchema = z.object({
    template_id: z.string(),
    ctc: z.any(),
})

type EmployeeFormValues = z.infer<typeof formSchema>

export const SalaryCard: React.FC<SalaryCardProps> = ({
    profile,
}) => {

    const [loading, setLoading] = useState(true)
    const [salaryData, setSalaryData] = useState(null)
    const [isOpen, setOpen] = useState(false);
    const { user } = useAuth();
    const [templates, setTemplates] = useState<SalaryTemplate[]>([]);
    const [template, setTemplate] = useState<SalaryTemplate | null>(null);
    const [earnings, setEarnings] = useState<any[]>([]);
    const [ctc, setCtc] = useState("0");


    async function fetchData() {

        //get if the salary template is associated
        await apiClient.get(`/salary-template/get-by-org/${user?.orgId}`).then((res) => res.data)
            .then((data) => {
                setTemplates(data)
            });

        await apiClient.get(`/profile-salary/get-by-profile/${profile.id}`).then((res) => res.data)
            .then((data) => {
                setSalaryData(data)
                setLoading(false)
            }).catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    if (error.response.status === 400) {
                        toast.error("Profile salary is not found");
                        setSalaryData(null)
                        setLoading(false)
                        // Inform the user about the bad request
                        // alert('Bad request. Please check your input.');
                    } else {
                        // For other errors, log the error message
                        console.log('Error:', error.message);
                    }
                } else {
                    // The request was made but no response was received
                    console.log('Error:', error.message);
                }
            });
    }

    const { flag, set } = useUpdateStore();

    useEffect(() => {
        fetchData();
    }, [flag])

    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
        mode: "onChange"
    });

    const onSubmit = async (data: EmployeeFormValues) => {
        console.log(data)
    };

    const onTemplateChange = async (data: string) => {
        console.log(data) 
        // find template by ID
        const employees = await apiClient.get(`/salary-template/${data}`);
        setTemplate(employees.data)
    };


    return (
        <>
            <TooltipProvider>
                <div className="flex-col">
                    <div className="flex-1">
                        {loading ?
                            (
                                <div className="grid h-screen place-items-center">
                                    <Loader className="animate-spin h-5 w-5 mr-3" />
                                </div>
                            )
                            : (
                                salaryData === null ?
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

                                                    <div className="grid md:grid-cols-4 gap-x-8 gap-y-4">
                                                        <FormField
                                                            control={form.control}
                                                            name="template_id"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Template Name <span className="text-red-500">*</span></FormLabel>
                                                                    <Select disabled={loading} onValueChange={(s) => {
                                                                        field.onChange(s);
                                                                        onTemplateChange(s);
                                                                    }} value={field.value} defaultValue={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue defaultValue={field.value} placeholder="Select a template" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            {templates.map((category) => (
                                                                                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="ctc"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>CTC <span className="text-red-600">*</span></FormLabel>
                                                                    <FormControl>
                                                                        <Input disabled={loading} placeholder="CTC" {...field}
                                                                            onChange={(e) => { setCtc(e.target.value); }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormDescription>{inWords(ctc ?? '0')}</FormDescription>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>

                                                    <Button disabled={loading} className="ml-auto" type="submit">
                                                        {loading &&
                                                            <Loader className="animate-spin h-5 w-5 mr-3" />}
                                                        Create
                                                    </Button>
                                                </form>
                                            </Form>
                                        </div>
                                    </div> :
                                    <div className="space-y-6">
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-md font-medium">Annual CTC</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-2xl font-bold ">
                                                        ₹0
                                                    </p>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-md font-medium">Monthly CTC</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-2xl font-bold ">
                                                        ₹0
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <SubHeading title={`Template name`} description={`Salary Template`} />
                                            {/* <Breadcrumb className="sm:block hidden">
                                                <BreadcrumbList>
                                                    <BreadcrumbItem>
                                                        <BreadcrumbLink href="/payroll/settings/salary-components">Salary Template</BreadcrumbLink>
                                                    </BreadcrumbItem>
                                                    <BreadcrumbSeparator>
                                                        <SlashIcon />
                                                    </BreadcrumbSeparator>
                                                    <BreadcrumbItem>
                                                        <BreadcrumbPage>Form</BreadcrumbPage>
                                                    </BreadcrumbItem>
                                                </BreadcrumbList>
                                            </Breadcrumb> */}
                                        </div>

                                        <div className="rounded-lg border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Salary Components</TableHead>
                                                        <TableHead className="w-[300px]">Calculation type</TableHead>
                                                        <TableHead>Monthly Amount</TableHead>
                                                        <TableHead>Annual Amount</TableHead>
                                                        <TableHead></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {earnings.map((item: any, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>

                                                                <Label>{item.componentName}</Label>

                                                            </TableCell>
                                                            <TableCell key={`${item.id}-table-cell`}>
                                                                <p>hey</p>
                                                                {/* <FormField
                                                        control={form.control}
                                                        name={`earnings.${index}.value`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <div className="relative">
                                                                        <div className='absolute right-0 h-10 flex justify-center items-center rounded-r-lg border'>
                                                                            <Label className="text-foreground px-4 text-sm">{calculationType(item.calculationType)}</Label>
                                                                        </div>
                                                                        <Input
                                                                            key={`${item.id}-input`}
                                                                            type={'text'}
                                                                            placeholder="Amount"
                                                                            className="pr-20"
                                                                            max={100}
                                                                            defaultValue={item.value}
                                                                            {...field}
                                                                            onBlur={(e) => {
                                                                                e.preventDefault();
                                                                                handleFieldChange(`${item.componentName}`, e.target.value, index);
                                                                                field.onChange(e);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    /> */}
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
                                                                        <Label>Fixed Allowance</Label>
                                                                        <Info className="h-4 w-4" />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="w-40">Fixed allowance is a residual component of salary that is left after allocations are made for all other components.</p>
                                                                </TooltipContent>
                                                            </Tooltip>

                                                        </TableCell>
                                                        <TableCell>Fixed amount</TableCell>
                                                        {/* <TableCell>₹{fixed.monthly?.toFixed()}</TableCell> */}
                                                        <TableCell>₹{`-`}</TableCell>
                                                        {/* <TableCell>₹{fixed.yearly?.toFixed()}</TableCell> */}
                                                        <TableCell>₹{`-`}</TableCell>
                                                        <TableCell></TableCell>
                                                    </TableRow>
                                                    <TableRow className={"bg-muted"}>
                                                        <TableCell>Cost to Company</TableCell>
                                                        <TableCell></TableCell>
                                                        {/* <TableCell>₹{ctc.monthly?.toFixed()}</TableCell> */}
                                                        <TableCell>₹{`-`}</TableCell>
                                                        {/* <TableCell>₹{ctc.yearly?.toFixed()}</TableCell> */}
                                                        <TableCell>₹{`-`}</TableCell>
                                                        <TableCell></TableCell>
                                                    </TableRow>
                                                </TableBody>

                                            </Table>
                                        </div>



                                    </div>
                            )}
                    </div>
                </div>
            </TooltipProvider>
        </>
    )
}