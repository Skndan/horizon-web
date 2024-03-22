"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
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

const payScheduleFormSchema = z.object({
    addressLine1: z.string().min(1),
    addressLine2: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1)
})

type payScheduleFormValues = z.infer<typeof payScheduleFormSchema>

// This can come from your database or API.
const defaultValues: Partial<payScheduleFormValues> = {
}

export function PayScheduleForm() {
    const form = useForm<payScheduleFormValues>({
        resolver: zodResolver(payScheduleFormSchema),
        defaultValues,
        mode: "onChange",
    })

    function onSubmit(data: payScheduleFormValues) {

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
                <h3 className="mb-4 text-lg font-semibold">Select your work week <span className="text-red-600">*</span></h3>
                <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel className=" text-muted-foreground">The days worked in a calendar week</FormLabel>
                            <FormControl>
                                <ToggleGroup type="multiple" className="justify-start" variant="outline">
                                    <ToggleGroupItem value="SUN">SUN</ToggleGroupItem>
                                    <ToggleGroupItem value="MON">MON</ToggleGroupItem>
                                    <ToggleGroupItem value="TUE">TUE</ToggleGroupItem>
                                    <ToggleGroupItem value="WED">WED</ToggleGroupItem>
                                    <ToggleGroupItem value="THU">THU</ToggleGroupItem>
                                    <ToggleGroupItem value="FRI">FRI</ToggleGroupItem>
                                    <ToggleGroupItem value="SAT">SAT</ToggleGroupItem>
                                </ToggleGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> 
                <h3 className="mb-4 text-lg font-semibold pt-4">Pay your employees on <span className="text-red-600">*</span></h3>
                <RadioGroup defaultValue="comfortable" className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="default" id="r3" />
                        <Label htmlFor="r3">Last working day of every month</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="comfortable" id="r4" />
                        <Label htmlFor="r4">Every month on </Label>
                        <Select>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="Select a date" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {Array.from({ length: 28 }).map((_, index) => (
                                        <SelectItem key={index} value={String(index + 1)} >{String(index + 1)}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </RadioGroup>
                <Button type="submit">Update</Button>
            </form>
        </Form>
    )
}