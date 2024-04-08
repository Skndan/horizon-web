"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
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
import { Edit, Info, Trash } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { ComponentType, Deduction, Earning, SalaryTemplate } from "@/types/payroll"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const salaryTemplateFormSchema = z.object({
    name: z.string(),
    description: z.string(),
    ctc: z.number(),
    earnings: z.array(z.object({
        id: z.string(),
        value: z.string()
    })),
    deductions: z.array(z.object({
        id: z.string(),
        value: z.string()
    }))
})

type ProfileFormValues = z.infer<typeof salaryTemplateFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
    earnings: [],
    deductions: []
}

interface EmployeeFormProps {
    initialData: SalaryTemplate | null;
    earningType: ComponentType[],
    deductionType: ComponentType[],
};

export const TemplateForm: React.FC<EmployeeFormProps> = ({
    initialData,
    earningType,
    deductionType,
}) => {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(salaryTemplateFormSchema),
        defaultValues,
        mode: "onChange",
    })

    const [earnings, setEarnings] = useState([{ id: '', value: '' }]);
    const [deductions, setDeductions] = useState([{ id: '', value: '' }]);

    const [earningComponent, setEarningComponent] = useState<Earning[]>([]);
    const [deductionComponent, setDeductionComponent] = useState<Deduction[]>([]);

    const { register, handleSubmit, setValue, getValues } = useForm({
        resolver: zodResolver(salaryTemplateFormSchema),
        defaultValues: {
            // Start with one item in each array
            earnings: [{ id: '', value: '' }],
            deductions: [{ id: '', value: '' }],
        }
    });

    const onSubmit = (data: any) => {
        console.log(data)
    };

    const addEarning = (id: string) => {
        const earnings = getValues('earnings');
        setEarnings([...earnings, { id: '', value: '' }]);
        setValue('earnings', [...earnings, { id: '', value: '' }]);
    };

    const removeEarning = (index: number) => {
        const earnings = getValues('earnings');
        setEarnings([...earnings.slice(0, index), ...earnings.slice(index + 1)]);
        setValue('earnings', [...earnings.slice(0, index), ...earnings.slice(index + 1)]);
    };

    const addDeduction = (id: string) => {
        const deductions = getValues('deductions');
        setDeductions([...deductions, { id: '', value: '' }]);
        setValue('deductions', [...deductions, { id: '', value: '' }]);
    };

    const removeDeduction = (index: number) => {
        const deductions = getValues('deductions');
        setDeductions([...deductions.slice(0, index), ...deductions.slice(index + 1)]);
        setValue('deductions', [...deductions.slice(0, index), ...deductions.slice(index + 1)]);
    };

    return (
        <TooltipProvider>
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
                        <div className=" rounded-md border first:flex flex-col md:flex-row gap-4 items-center p-4 my-4">
                            <Label>Annual CTC</Label>
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <div className='absolute right-0 h-10 flex justify-center items-center rounded-r-lg border'>
                                            <Label className="text-foreground px-4 text-sm">per year</Label>
                                        </div>
                                        <Input
                                            type={'text'}
                                            placeholder="CTC"
                                            className="pr-20"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                            {/* <Label className="flex-1 text-muted-foreground">This CTC will not be saved in the template, you can validate the earning and deduction distributions</Label> */}
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Salary Components</TableHead>
                                        <TableHead>Calculation type</TableHead>
                                        <TableHead>Monthly Amount</TableHead>
                                        <TableHead>Annual Amount</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>

                                    {getValues('earnings').map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`earnings.${index}.id`}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue defaultValue={field.value} placeholder="Select Earning Type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {earningComponent.map((earning: Earning) => (
                                                                    <SelectItem key={earning.id} value="m@example.com">m@example.com</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`earnings.${index}.value`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <div className='absolute right-0 h-10 flex justify-center items-center rounded-r-lg border'>
                                                                        <Label className="text-foreground px-4 text-sm">per year</Label>
                                                                    </div>
                                                                    <Input
                                                                        type={'text'}
                                                                        placeholder="CTC"
                                                                        className="pr-20"
                                                                        {...field}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Label>
                                                    Monthly Amount
                                                </Label>
                                            </TableCell>
                                            <TableCell>
                                                <Label>
                                                    Yearly Amount
                                                </Label>
                                            </TableCell>
                                            <TableCell>
                                                <Button size={"icon"} variant={"outline"} onClick={(e) => {
                                                    e.preventDefault();
                                                    removeEarning(index);
                                                }}>
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    <TableRow className="bg-muted">
                                        <TableCell className="py-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm" >
                                                        Add Earnings
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {earningType.map((earning) => (
                                                        <>
                                                            <DropdownMenuItem key={earning.id} onClick={(e) => {

                                                                addEarning(earning.id);
                                                            }}>
                                                                {earning.name}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                        </>
                                                    ))}


                                                </DropdownMenuContent>
                                            </DropdownMenu>



                                            {/* <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addEarning();
                                                }}>
                                                Add Earnings
                                            </Button> */}
                                        </TableCell>
                                        <TableCell className="p-1"> </TableCell>
                                        <TableCell className="p-1"> </TableCell>
                                        <TableCell className="p-1"> </TableCell>
                                        <TableCell className="p-1"> </TableCell>
                                    </TableRow>


                                    {getValues('deductions').map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`deductions.${index}.id`}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select earnings" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="m@example.com">m@example.com</SelectItem>
                                                                <SelectItem value="m@google.com">m@google.com</SelectItem>
                                                                <SelectItem value="m@support.com">m@support.com</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`deductions.${index}.value`}
                                                    render={({ field }) => (
                                                        <FormItem>

                                                            <FormControl>
                                                                <Input placeholder="Employee Office Email" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Label>
                                                    Monthly Amount
                                                </Label>
                                            </TableCell>
                                            <TableCell>
                                                <Label>
                                                    Yearly Amount
                                                </Label>
                                            </TableCell>
                                            <TableCell>
                                                <Button size={"icon"} variant={"outline"} onClick={(e) => {
                                                    e.preventDefault();
                                                    removeDeduction(index);
                                                }}>
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    <TableRow className="bg-muted p-0">
                                        <TableCell className="py-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm" >
                                                        Add Deductions
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {deductionType.map((deduction) => (
                                                        <>
                                                            <DropdownMenuItem key={deduction.id} onClick={(e) => {
                                                                addDeduction(deduction.id);
                                                            }}>
                                                                {deduction.name}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                        </>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell className="p-1"> </TableCell>
                                        <TableCell className="p-1"> </TableCell>
                                        <TableCell className="p-1">

                                        </TableCell>
                                        <TableCell> </TableCell>
                                    </TableRow>

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
                                        <TableCell>₹7083</TableCell>
                                        <TableCell>₹85000</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableBody>
                                <TableFooter>
                                    <TableCell>Cost to Company</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>₹7083</TableCell>
                                    <TableCell>₹85000</TableCell>
                                    <TableCell></TableCell>
                                </TableFooter>
                            </Table>
                        </div>
                    </div>
                    <Button type="submit">Update profile</Button>
                </form>
            </Form>
        </TooltipProvider>

    )
}