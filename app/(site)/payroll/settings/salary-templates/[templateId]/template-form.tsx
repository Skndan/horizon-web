"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Edit, Info, SlashIcon, Trash } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { ComponentType, SalaryComponentItem, SalaryTemplate, SalaryTemplateItem } from "@/types/payroll"

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SubHeading } from "@/components/ui/sub-heading"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area"
import { calculationType, inWords, numberToEnglish } from "@/lib/utils/string-utils"
import apiClient from "@/lib/api/api-client"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

const salaryTemplateFormSchema = z.object({
    name: z.string(),
    description: z.string(),
    ctc: z.any(),
    fixed: z.any(),
    earnings: z.any()
})

type ProfileFormValues = z.infer<typeof salaryTemplateFormSchema>


interface TemplateFormProps {
    initialData: SalaryTemplate | null;
    earningType: SalaryTemplateItem[],
    deductionType: SalaryTemplateItem[],
};

export const TemplateForm: React.FC<TemplateFormProps> = ({
    initialData,
    earningType,
    deductionType,
}) => {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(salaryTemplateFormSchema),
        defaultValues: initialData || {
            name: '',
            description: '',
            ctc: '0',
            earnings: []
        },
        mode: "onChange",
    })

    const router = useRouter();

    const [ctc, setCtc] = useState(initialData?.ctc ? { monthly: initialData.ctc / 12, yearly: initialData.ctc } : { monthly: 0, yearly: 0 });
    const [fixed, setFixed] = useState(initialData?.fixed ? { monthly: initialData.fixed / 12, yearly: initialData.fixed } : { monthly: 0, yearly: 0 });
    const [loading, setLoading] = useState(false);

    const [earnings, setEarnings] = useState<SalaryComponentItem[]>(initialData ? initialData!.earnings.map((item) => {

        let monthly = 0;
        let yearly = 0;

        switch (item.calculationType) {
            case "FIXED_AMOUNT":
                monthly = item.value / 12;
                yearly = Number(item.value);
                break;
            case "PERCENTAGE_OF_CTC":
                monthly = ((item.value / 100) * ctc.monthly);
                yearly = (item.value / 100) * ctc.yearly;
                break;
            // find basic
            case "PERCENTAGE_OF_BASIC":

                // find basic's monthly and yearly
                var dd = initialData!.earnings.find(item => item.componentName === "Basic");

                if (!dd) {
                    toast.error("Add basic first");
                }

                monthly = (item.value / 100) * ctc.monthly;
                yearly = (item.value / 100) * ctc.yearly;

                break;
        }

        return {
            id: item.id,
            componentName: item.componentName,
            value: item.value,
            componentType: item.componentType,
            calculationType: item.calculationType,
            monthly: monthly,
            yearly: yearly,
        };
    }) : []);

    const title = (initialData?.createdAt === initialData?.updatedAt) ? 'Create Template ✨' : 'Edit Template ✨';
    const description = (initialData?.createdAt === initialData?.updatedAt) ? 'Add a new template' : 'Edit a template.';
    const toastMessage = (initialData?.createdAt === initialData?.updatedAt) ? 'Template created.' : 'Template updated.';
    const action = 'Save changes';

    const onSubmit = async (data: ProfileFormValues) => {

        data.earnings = earnings;
        data.ctc = ctc.yearly;
        data.fixed = fixed.yearly;

        try {
            setLoading(true);
            if (initialData?.id) {
                await apiClient
                    .put(`/salary-template/${initialData.id}`, data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        router.push(`../salary-templates`);
                    });
            } else {
                await apiClient
                    .post("/salary-template", data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        router.push(`../salary-templates`);
                    });
            }
        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }

    };

    const watchCtc = useWatch({
        control: form.control,
        name: "ctc",
        defaultValue: "0",
    })



    // Function to be triggered whenever there's a change in the form fields
    const handleFieldChange = (fieldName: string, value: any, index: number) => {
        // Perform your desired actions here, such as sending data to an API or updating state

        if ((earnings.length === 0) && (fieldName === "ctc")) {
            const monthly = (Number(value) / 12).toFixed();
            setCtc({ monthly: Number(monthly), yearly: Number(value) })
            setFixed({ monthly: Number(monthly), yearly: Number(value) })
        } else {

            let fixedMonthly = 0;
            let fixedYearly = 0;

            earnings.forEach(element => {

                let monthly = 0;
                let yearly = 0;

                if (element.id === earnings[index].id) {
                    // find type 
                    switch (element.calculationType) {
                        case "FIXED_AMOUNT":
                            monthly = value / 12;
                            yearly = Number(value);
                            break;
                        case "PERCENTAGE_OF_CTC":
                            monthly = ((value / 100) * ctc.monthly);
                            yearly = (value / 100) * ctc.yearly;
                            break;
                        // find basic
                        case "PERCENTAGE_OF_BASIC":

                            // find basic's monthly and yearly
                            var dd = earnings.find(item => item.componentName === "Basic");
                            if (!dd) {
                                toast.error("Add basic first");
                            }

                            monthly = (value / 100) * dd!.monthly;
                            yearly = (value / 100) * dd!.yearly;

                            break;
                    }

                    element.monthly = monthly;
                    element.yearly = yearly;

                    // const earnings_ = getValues('earnings');
                    // setValue('earnings', [...earnings_, {
                    //     id: value.id,
                    //     componentName: value.componentName,
                    //     value: value,
                    //     monthly: monthly,
                    //     yearly: yearly,
                    //     componentType: value.componentType,
                    //     calculationType: value.calculationType,
                    // }] as never);

                    // calculate
                    setEarnings(prevState => {
                        // Loop over your list
                        return prevState.map((item) => {
                            // Check for the item with the specified id and update it 
                            return item.id === earnings[index].id ? { ...item, monthly: monthly, yearly: yearly, value: value } : item
                        })
                    })
                }
            });
            // update each item
            earnings.forEach(element => {
                if (element.componentType.type === "EARNING") {
                    fixedMonthly += element.monthly;
                    fixedYearly += element.yearly
                } else {
                    fixedMonthly -= element.monthly;
                    fixedYearly -= element.yearly
                }
            })

            // update fixed item  
            setFixed({ monthly: ctc.monthly - fixedMonthly, yearly: ctc.yearly - fixedYearly })
        }
    };

    const addEarning = async (value: SalaryTemplateItem) => {
        // const earnings = getValues('earnings');

        let monthly = 0;
        let yearly = 0;

        switch (value.calculationType) {
            case "FIXED_AMOUNT":
                monthly = value.value / 12;
                yearly = value.value;
                break;
            case "PERCENTAGE_OF_CTC":
                monthly = ((value.value / 100) * ctc.monthly);
                yearly = (value.value / 100) * ctc.yearly;
                break;
            case "PERCENTAGE_OF_BASIC":
                // find basic's monthly and yearly
                var dd = earnings.find(item => item.componentName === "Basic");

                if (!dd) {
                    toast.error("Add basic first");
                }

                monthly = ((value.value / 100) * dd!.monthly);
                yearly = (value.value / 100) * dd!.yearly;
                break;
        }

        setEarnings([...earnings, {
            id: value.id,
            componentName: value.componentName,
            value: value.value,
            monthly: monthly,
            yearly: yearly,
            componentType: value.componentType,
            calculationType: value.calculationType,
        }]);

        setFixed({ monthly: fixed.monthly - monthly, yearly: fixed.yearly - yearly })
    };

    const removeEarning = (index: number) => {
        const monthly = earnings[index].monthly;
        const yearly = earnings[index].yearly;

        setFixed({ monthly: fixed.monthly + monthly, yearly: fixed.yearly + yearly })
        setEarnings([...earnings.slice(0, index), ...earnings.slice(index + 1)]);
    };

    return (
        <TooltipProvider>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <SubHeading title={title} description={description} />
                    <Breadcrumb className="sm:block hidden">
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
                    </Breadcrumb>
                </div>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex-2">
                                        <FormLabel>Template Name <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Template Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>

                            <div className="flex flex-row  rounded-t-md border-t border-l border-r items-center justify-between p-4">
                                <div className="first:flex  md:flex-row gap-4 items-center">
                                    <Label>Annual CTC</Label>
                                    <FormField
                                        control={form.control}
                                        name="ctc"
                                        disabled={earnings.length != 0}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative">
                                                        <div className='absolute right-0 h-10 flex justify-center items-center rounded-r-lg border'>
                                                            <Label className="text-foreground px-4 text-sm">per year</Label>
                                                        </div>
                                                        <Input
                                                            type={'number'}
                                                            placeholder="CTC"
                                                            className="pr-20"
                                                            {...field}
                                                            onChange={(e) => {
                                                                handleFieldChange('ctc', e.target.value, -1);
                                                                field.onChange(e);
                                                            }}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Label className="text-muted-foreground">{inWords(ctc.yearly.toString())}</Label>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button disabled={watchCtc === "" || watchCtc === "0"}
                                            size="sm" >
                                            Add Components
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <ScrollArea className="h-[250px] w-[200px]">
                                            <DropdownMenuLabel className="text-green-500">Earnings</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {earningType.map((earning) => (
                                                <>
                                                    <DropdownMenuItem disabled={earnings.find(x => x.id === earning.id) !== undefined} key={earning.id} onClick={(e) => {
                                                        addEarning(earning);
                                                    }}>
                                                        {earning.componentName}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                </>
                                            ))}
                                            <DropdownMenuLabel className="text-red-500">Deductions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {deductionType.map((deduction) => (
                                                <>
                                                    <DropdownMenuItem disabled={earnings.find(x => x.id === deduction.id) !== undefined} key={deduction.id} onClick={(e) => {
                                                        addEarning(deduction);
                                                    }}>
                                                        {deduction.componentName}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                </>
                                            ))}
                                        </ScrollArea>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                            </div>
                            <div className="rounded-b-md border">
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
                                                    <>
                                                        <FormField
                                                            control={form.control}
                                                            name={`earnings.${index}.id`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input key={`${item.id}-id`} type="hidden"  {...field} value={item.id} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <Label>{item.componentName}</Label>
                                                    </>
                                                </TableCell>
                                                <TableCell key={`${item.id}-table-cell`}>
                                                    <FormField
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
                                                    />
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
                                                <TableCell>
                                                    <Button size={"icon"} variant={"outline"} className="text-red-500" onClick={(e) => {
                                                        e.preventDefault();
                                                        removeEarning(index);
                                                    }}>
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
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
                                            <TableCell>₹{fixed.monthly?.toFixed()}</TableCell>
                                            <TableCell>₹{fixed.yearly?.toFixed()}</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                        <TableRow className={"bg-muted"}>
                                            <TableCell>Cost to Company</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>₹{ctc.monthly?.toFixed()}</TableCell>
                                            <TableCell>₹{ctc.yearly?.toFixed()}</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>

                                </Table>
                            </div>
                        </div>
                        <Button type="submit">{action}</Button>
                    </form>
                </Form>
            </div>

        </TooltipProvider>

    )
}