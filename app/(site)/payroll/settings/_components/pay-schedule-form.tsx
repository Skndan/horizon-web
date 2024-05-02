"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Eye } from "lucide-react"
import { PaySchedule } from "@/types/payroll"
import { useAuth } from "@/context/auth-provider"
import { useState } from "react"
import toast from "react-hot-toast"
import apiClient from "@/lib/api/api-client"
import { useRouter } from "next/navigation"

const payScheduleFormSchema = z.object({
    organisation: z.any(),
    payDay: z.string(),
    payDayValue: z.any(),
    payCheck: z.string(),
    payCheckValue: z.any(),
}).refine(input => {

    // allows bar to be optional only when foo is 'foo'
    if (input.payDay === "SPECIFIC" && input.payDayValue === undefined) return false
    if (input.payCheck === "SPECIFIC" && input.payCheckValue === undefined) return false

    return true
})

type payScheduleFormValues = z.infer<typeof payScheduleFormSchema>

interface PayScheduleProps {
    initialData: PaySchedule | null;
};

export const PayScheduleForm: React.FC<PayScheduleProps> = ({
    initialData
}) => {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const toastMessage = 'Pay schedule updated';

    const { user } = useAuth();

    const form = useForm<payScheduleFormValues>({
        resolver: zodResolver(payScheduleFormSchema),
        defaultValues: initialData || {
            organisation: {
                id: ''
            }
        },
        mode: "onChange",
    })

    async function onSubmit(data: payScheduleFormValues) {

        try {

            data.organisation.id = user?.orgId;

            setLoading(true);

            if (initialData) {
                await apiClient
                    .put(`/pay-schedule/${initialData.id}`, data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        router.refresh();
                    });
            } else {
                await apiClient
                    .post("/pay-schedule", data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        router.refresh();
                    });
            }

        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    const isPayDay = useWatch({
        control: form.control,
        name: 'payDay', // Name of the field you want to watch
    });

    const isPayCheck = useWatch({
        control: form.control,
        name: 'payCheck', // Name of the field you want to watch
    });


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <h3 className="mb-4 text-lg font-semibold">Process payslips on <span className="text-red-600">*</span></h3>
                <FormField
                    control={form.control}
                    name="payDay"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RadioGroup defaultValue="LAST_WORKING_DAY" className="space-y-2" value={field.value} onValueChange={field.onChange}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="LAST_WORKING_DAY" id="r1" />
                                        <Label htmlFor="r1">Last working day of every month</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="SPECIFIC" id="r2" />
                                        <Label htmlFor="r2">Every month on </Label>
                                        <FormField
                                            control={form.control}
                                            name="payDayValue"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select disabled={isPayDay === "SPECIFIC" ? false : true} required={isPayDay === "SPECIFIC" ? true : false} defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-[150px]">
                                                                <SelectValue defaultValue={field.value} placeholder="Select a date" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent defaultValue={field.value}> 
                                                            {Array.from({ length: 28 }).map((_, index) => (
                                                                <SelectItem key={index} value={String(index + 1)} >{String(index + 1)}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <h3 className="mb-4 text-lg font-semibold pt-4">Pay your employees on <span className="text-red-600">*</span></h3>
                <FormField
                    control={form.control}
                    name="payCheck"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RadioGroup defaultValue="LAST_WORKING_DAY" className="space-y-2" value={field.value} onValueChange={field.onChange}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="LAST_WORKING_DAY" id="r3" />
                                        <Label htmlFor="r3">Last working day of every month</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="SPECIFIC" id="r4" />
                                        <Label htmlFor="r4">Every month on </Label>

                                        <FormField
                                            control={form.control}
                                            name="payCheckValue"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select disabled={isPayCheck === "SPECIFIC" ? false : true} defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-[150px]">
                                                                <SelectValue defaultValue={field.value} placeholder="Select a date" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {Array.from({ length: 28 }).map((_, index) => (
                                                                <SelectItem key={index} value={String(index + 1)} >{String(index + 1)}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <p className="text-muted-foreground text-sm">Note: When payday falls on a non-working day or a holiday, employees will get paid on the previous working day.</p>
                <Button type="submit">Update</Button>
            </form>
        </Form>
    )
}