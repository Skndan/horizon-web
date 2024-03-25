"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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

const addressFormSchema = z.object({
    addressLine1: z.string().min(1),
    addressLine2: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1)
})

type AddressFormValues = z.infer<typeof addressFormSchema>
 
export function AddressForm() {
    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {},
        mode: "onChange",
    })

    function onSubmit(data: AddressFormValues) {

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
                <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                        <FormItem>
                          
                            <FormControl>
                                <Input placeholder="No. 6, Vivekanandar Lane" {...field} />
                            </FormControl> 
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                        <FormItem> 
                            <FormControl>
                                <Input placeholder="Cross Street" {...field} />
                            </FormControl> 
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-3 space-x-4">
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input placeholder="State" {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    This email address will receive the notification from Horizon
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="City" {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    This mobile number will used for KYC
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pincode</FormLabel>
                                <FormControl>
                                    <Input placeholder="607001" {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    This mobile number will used for KYC
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit">Update Address</Button>
            </form>
        </Form>
    )
}