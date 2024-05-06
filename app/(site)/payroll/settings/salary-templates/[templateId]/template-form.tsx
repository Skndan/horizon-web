"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input" 
import toast from "react-hot-toast"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Info, SlashIcon, Trash } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { SalaryTemplate, SalaryTemplateItem } from "@/types/payroll"

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

    const [template, setTemplate] = useState<SalaryTemplate | null>(initialData);

    const [earnings, setEarnings] = useState<SalaryTemplateItem[]>(initialData?.earnings ?? []);

    const [ctc, setCtc] = useState(template?.ctc ? { monthly: template.ctc / 12, yearly: template.ctc } : { monthly: 0, yearly: 0 });

    const [loading, setLoading] = useState(false);

    const title = (initialData?.createdAt === initialData?.updatedAt) ? 'Create Template' : 'Edit Template';
    const description = (initialData?.createdAt === initialData?.updatedAt) ? 'Add a new template' : 'Edit a template.';
    const toastMessage = (initialData?.createdAt === initialData?.updatedAt) ? 'Template created.' : 'Template updated.';
    const action = 'Save changes';

    const onSubmit = async (data: ProfileFormValues) => {

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
            setLoading(false);
        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }

    };


    // Function to be triggered whenever there's a change in the form fields
    const handleFieldChange = async (fieldName: string, value: any, index: number) => {
        // Perform your desired actions here, such as sending data to an API or updating state  
        var obj = {
            [fieldName]: value,
            earnings: earnings
        }

        if (fieldName === "ctc") {
            await apiClient
                .put(`/salary-template/${initialData?.id}`, obj)
                .then((res) => res.data)
                .then((data) => {
                    setTemplate(data);
                    setEarnings(convertStringDatesToDateObjects(data.earnings).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()));
                    setCtc(data?.ctc ? { monthly: data.ctc / 12, yearly: data.ctc } : { monthly: 0, yearly: 0 });
                });
        } else {
            console.log(`fieldName:${fieldName} value:${value} index:${index}`)

            let item = earnings[index];
            item.value = value;

            console.log(item);

            await apiClient
                .put(`/salary-template/line/${initialData?.id}`, item)
                .then((res) => res.data)
                .then((data) => {
                    setTemplate(data);
                    setEarnings(convertStringDatesToDateObjects(data.earnings).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()));
                });
        }
    };

    const convertStringDatesToDateObjects = (items: SalaryTemplateItem[]) => {
        return items.map(item => {
            return {
                ...item,
                createdAt: typeof item.createdAt === 'string' ? new Date(item.createdAt) : item.createdAt,
                updatedAt: typeof item.updatedAt === 'string' ? new Date(item.updatedAt) : item.updatedAt,
            };
        });
    };


    const addEarning = async (value: SalaryTemplateItem) => {
        // const earnings = getValues('earnings');

        console.log(value);

        if ((earnings.find(x => x.componentName === "Basic") === undefined) && (value.componentName !== "Basic")) {
            toast.error("Please add Basic first")
            return;
        }
        // add 
        setEarnings([]);
        await apiClient
            .put(`/salary-template/line/${initialData?.id}`, value)
            .then((res) => res.data)
            .then((data) => {
                setTemplate(data);
                setEarnings(convertStringDatesToDateObjects(data.earnings).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()));
            });
    };

    const removeEarning = async (index: number) => {
        await apiClient
            .delete(`/salary-template/line/${earnings[index].id}/${template?.id}`)
            .then((res) => res.data)
            .then((data) => {
                setTemplate(data);
                setEarnings([...earnings.slice(0, index), ...earnings.slice(index + 1)]);
            });
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
                                        {/* disabled={watchCtc === "" || watchCtc === "0"} */}
                                        <Button size="sm" >
                                            Add Components
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <ScrollArea className="h-[250px] w-[200px]">
                                            <DropdownMenuLabel className="text-green-500">Earnings</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {earningType.map((earning) => (
                                                <>
                                                    <DropdownMenuItem disabled={earnings.find(x => x.componentName === earning.componentName) !== undefined} key={earning.id} onClick={(e) => {
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
                                                    <DropdownMenuItem disabled={earnings.find(x => x.componentName === deduction.componentName) !== undefined} key={deduction.id} onClick={(e) => {
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
                                                        <Label className={item.componentType.type === "EARNING" ? "text-green-600" : "text-red-600"}>
                                                            +₹{item.monthly?.toFixed()}
                                                        </Label>
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        <Label className={item.componentType.type === "EARNING" ? "text-green-600" : "text-red-600"}>
                                                            +₹{item.yearly?.toFixed()}
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
                                                            <Label>Special Allowance</Label>
                                                            <Info className="h-4 w-4" />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="w-40">Special allowance is a residual component of salary that is left after allocations are made for all other components.</p>
                                                    </TooltipContent>
                                                </Tooltip>

                                            </TableCell>
                                            <TableCell>Fixed amount</TableCell>
                                            <TableCell>₹{(template!.fixed / 12).toFixed()}</TableCell>
                                            <TableCell>₹{template!.fixed.toFixed()}</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                        <TableRow className={"bg-muted"}>
                                            <TableCell>Cost to Company</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>₹{(template!.ctc / 12).toFixed()}</TableCell>
                                            <TableCell>₹{template!.ctc.toFixed()}</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>

                                </Table>
                            </div>
                        </div>
                        <Button disabled={loading || !form.formState.isValid} type="submit">{action}</Button>
                    </form>
                </Form>
            </div>

        </TooltipProvider>

    )
}