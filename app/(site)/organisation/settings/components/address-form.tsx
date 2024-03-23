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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

const addressFormSchema = z.object({
    label: z.string().min(1),
    addressLine1: z.string().min(1),
    addressLine2: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1),
    isBillingAddress: z.any()
})

interface AddressFormProps {
    onClose: () => void;
}

type AddressFormValues = z.infer<typeof addressFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AddressFormValues> = {
}

export const AddressForm: React.FC<AddressFormProps> = ({
    onClose,
}) => {




    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressFormSchema),
        defaultValues,
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
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Office name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                <FormField
                    control={form.control}
                    name="isBillingAddress"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Mark this as Billing address  <span className="text-muted-foreground pl-2"> {"(Existing billing address will be replaced)"}</span>
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                <Button type="submit">Update Address</Button>
                <Button variant={"secondary"} className="m-4" onClick={onClose}>Cancel </Button>
            </form>
        </Form>
    )
}