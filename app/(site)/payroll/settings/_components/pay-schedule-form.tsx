"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader } from "lucide-react"
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
    payMonth: z.any(),
    payDateFrom: z.any(),
    payDateTo: z.any(),
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

const days = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"
]

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
                <h3 className="mb-4 text-lg font-semibold">When you process payrolls <span className="text-red-600">*</span></h3>
                <FormField
                    control={form.control}
                    name="payMonth"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RadioGroup defaultValue="NEXT_MONTH" className="space-y-2" value={field.value} onValueChange={field.onChange}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="NEXT_MONTH" id="r5" />
                                        <Label htmlFor="r5">Next Month</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="SAME_MONTH" id="r6" />
                                        <Label htmlFor="r6">Same Month</Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <h3 className="mb-4 text-lg font-semibold pt-4">Process payslips on <span className="text-red-600">*</span></h3>
                <FormField
                    control={form.control}
                    name="payCheck"
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
                                            name="payCheckValue"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select disabled={isPayCheck === "SPECIFIC" ? false : true} required={isPayCheck === "SPECIFIC" ? true : false} defaultValue={field.value.toString()} value={field.value.toString()} onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-[150px]">
                                                                <SelectValue defaultValue={field.value.toString()} placeholder="Select a date" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {days.map((day) => (
                                                                <SelectItem key={day} value={day}>{day}</SelectItem>
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
                    name="payDay"
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
                                            name="payDayValue"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select disabled={isPayDay === "SPECIFIC" ? false : true} defaultValue={field.value.toString()} value={field.value.toString()} onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-[150px]">
                                                                <SelectValue defaultValue={field.value.toString()} placeholder="Select a date" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {days.map((day) => (
                                                                <SelectItem key={day} value={day}>{day}</SelectItem>
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

                <h3 className="text-lg font-semibold pt-4">Pay cycle <span className="text-red-600">*</span></h3>
                <div className="flex items-center space-x-2">
                    <Label htmlFor="r4">Pay period from </Label>
                    <FormField
                        control={form.control}
                        name="payDateFrom"
                        render={({ field }) => (
                            <FormItem>
                                <Select defaultValue={field.value.toString()} value={field.value.toString()} onValueChange={(s) => {
                                    field.onChange(s);
                                    form.setValue("payDateTo", s);
                                }}>
                                    <FormControl>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue defaultValue={field.value.toString()} placeholder="Select a date" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {days.map((day) => (
                                            <SelectItem key={day} value={day}>{day}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Label htmlFor="r4"> to </Label>
                    <FormField
                        control={form.control}
                        name="payDateTo"
                        render={({ field }) => (
                            <FormItem>
                                <Select disabled={true} defaultValue={field.value.toString()} value={field.value.toString()} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue defaultValue={field.value.toString()} placeholder="Select a date" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {days.map((day) => (
                                            <SelectItem key={day} value={day}>{day}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <p className="text-muted-foreground text-sm">Note: When payday falls on a non-working day or a holiday, employees will get paid on the previous working day.</p>
                <Button disabled={loading} type="submit">
                    {loading &&
                        <Loader className="animate-spin h-5 w-5 mr-3" />}
                    Update
                </Button>
            </form>
        </Form>
    )
}