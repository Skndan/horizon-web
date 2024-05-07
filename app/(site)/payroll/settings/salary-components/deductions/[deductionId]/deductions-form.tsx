"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Banknote, SlashIcon, SquarePercent } from "lucide-react"
import toast from "react-hot-toast"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ComponentType, SalaryComponent } from "@/types/payroll"
import apiClient from "@/lib/api/api-client"
import { useRouter } from "next/navigation"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SubHeading } from "@/components/ui/sub-heading"
import { Separator } from "@radix-ui/react-dropdown-menu"

const deductionsFormSchema = z.object({
    componentName: z.string().min(1),
    componentInPayslip: z.string().min(1),
    componentType: z.any(),
    calculationType: z.any(),
    value: z.any(),
    active: z.any(),
})

type DeductionsFormValues = z.infer<typeof deductionsFormSchema>


interface DeductionFormProps {
    initialData: SalaryComponent | null;
    types: ComponentType[];
};

export const DeductionForm: React.FC<DeductionFormProps> = ({
    initialData,
    types,
}) => {
    const form = useForm<DeductionsFormValues>({
        resolver: zodResolver(deductionsFormSchema),
        defaultValues: initialData || {},
        mode: "onChange",
    })

    const router = useRouter();

    const [type, setType] = useState(initialData ? initialData.calculationType : 'FIXED_AMOUNT');
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit Deduction ✨' : 'Create Deduction ✨';
    const description = initialData ? 'Edit a deduction.' : 'Add a new deduction';
    const toastMessage = initialData ? 'Deduction updated.' : 'Deduction created.';
    const action = initialData ? 'Save changes' : 'Create';

    async function onSubmit(data: DeductionsFormValues) {
        try {
            setLoading(true);
            if (initialData) {
                await apiClient
                    .put(`/salary-component/${initialData.id}`, data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        router.push(`../../salary-components`);
                    });
            } else {
                await apiClient
                    .post("/salary-component", data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        router.push(`../../salary-components`);
                    });
            }
        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="space-y-6 lg:max-w-2xl">
            <div className="flex items-center justify-between">
                <SubHeading title={title} description={description} />
                <Breadcrumb className="sm:block hidden">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/payroll/settings/salary-components">Deductions</BreadcrumbLink>
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="componentType.id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Deduction Type <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select deduction type" defaultValue={field.value} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {types.map((size) => (
                                                    <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 space-x-4">
                        <FormField
                            control={form.control}
                            name="componentName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deduction Name <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Deduction name" {...field} />
                                    </FormControl>
                                    {/* <FormDescription>
                                    {}
                                </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="componentInPayslip"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name in Payslip <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name in Payslip" {...field} />
                                    </FormControl>
                                    {/* <FormDescription>
                                   {}
                                </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <p className="mb-2 text-sm pt-4">Calculation Type <span className="text-red-600">*</span></p>
                    <FormField
                        control={form.control}
                        name="calculationType"
                        render={({ field }) => (
                            <FormItem>
                                <RadioGroup className="space-y-2" value={field.value} defaultValue={field.value} onValueChange={(e) => {
                                    field.onChange(e);
                                    setType(e);
                                }} >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="FIXED_AMOUNT" id="r3" />
                                        <Label htmlFor="r3">Flat Amount <span className="text-muted-foreground">{`(Yearly/Monthly)`}</span></Label>
                                        <FormDescription>Use Monthly Flat Amount for Expenses and Adjustments</FormDescription>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="PERCENTAGE_OF_CTC" id="r4" />
                                        <Label htmlFor="r4">Percentage of CTC</Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="PERCENTAGE_OF_BASIC" id="r4" />
                                        <Label htmlFor="r4">Percentage of Basic</Label>
                                    </div>
                                </RadioGroup>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <p className="mb-2 text-sm pt-4">{type == "FIXED_AMOUNT" ? "Enter amount" : "Enter percentage"} <span className="text-red-600">*</span></p>
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <div className="relative w-56">
                                    {type == "FIXED_AMOUNT" ? <Banknote className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" /> : <SquarePercent className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />}
                                    <Input placeholder={type == "FIXED_AMOUNT" ? "Amount" : "Percentage"} type="number" className="pl-8" {...field} />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-56">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Mark this as Active
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">{action}</Button>
                </form>
            </Form>
        </div>
    )
}

// PARTICULARS AMOUNT (RS.)
// BASIC 24,220
// HOUSE RENT ALLOWANCE 12,110
// CONVEYANCE ALLOWANCE -
// MEDICAL ALLOWANCE -
// LEAVE TRAVEL ALLOWANCE -
// SPECIAL ALLOWANCE 24,220
// OTHER ALLOWANCE / NOTICE PERIOD PAY -
// BONUS -
// ARREARS -
// GROSS SALARY 60,550
// LESS: DEDUCTIONS
// PROFESSION TAX 200
// PROVIDENT FUND 1,800
// OTHER DECUTION - EXCESS BONUS -
// VOLUNTARY PROVIDENT FUND CONTRIBUTION -
// INCOME TAX -
// TOTAL OF DEDUCTIONS 2,000
// NET SALARY PAID 58,550

