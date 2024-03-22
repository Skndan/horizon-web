"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Banknote, Search, SquarePercent } from "lucide-react"
import toast from "react-hot-toast"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"

const deductionsFormSchema = z.object({
    name: z.string().min(1),
    nameInPayslip: z.string().min(1),
    type: z.string().min(1),
    value: z.any(),
    isActive: z.any()
})

type DeductionsFormValues = z.infer<typeof deductionsFormSchema>

// This can come from your database or API.
const defaultValues: Partial<DeductionsFormValues> = {
}

export function DeductionsForm() {
    const form = useForm<DeductionsFormValues>({
        resolver: zodResolver(deductionsFormSchema),
        defaultValues,
        mode: "onChange",
    })

    const [type, setType] = useState('flat');

    const handleMenuItemClick = (value: string) => {
        toast.success(value);
        setType(value);
    };

    function onSubmit(data: DeductionsFormValues) {
        console.log(data);


        // toast({
        //   title: "You submitted the following values:",
        //   description: (
        //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //     </pre>
        //   ),
        // })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 space-x-4">
                    <FormField
                        control={form.control}
                        name="name"
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
                        name="nameInPayslip"
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
                <RadioGroup defaultValue="flat" className="space-y-2" onValueChange={handleMenuItemClick}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flat" id="r3" />
                        <Label htmlFor="r3">Flat Amount</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percent" id="r4" />
                        <Label htmlFor="r4">Percentage of CTC</Label>
                    </div>
                </RadioGroup>
                <p className="mb-2 text-sm pt-4">{type == "flat" ? "Enter amount" : "Enter percentage"} <span className="text-red-600">*</span></p>
                <div className="relative w-40">
                    {type == "flat" ? <Banknote className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /> : <SquarePercent className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />}
                    <Input placeholder={type == "flat" ? "Amount" : "Percentage"} type="number" className="pl-8" />
                </div>
                <FormField
                    control={form.control}
                    name="isActive"
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
                <Button type="submit">Save</Button>
            </form>
        </Form>
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