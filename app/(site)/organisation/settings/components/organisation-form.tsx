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
import ImageUpload from "@/components/ui/image-upload"

const organisationFormSchema = z.object({
    name: z.string().min(1),
    email: z.string().min(1),
    mobile: z.string().min(1),
    logo: z.any(),
    type: z.any(),
})

type ProfileFormValues = z.infer<typeof organisationFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
}

export function OrganisationForm() {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(organisationFormSchema),
        defaultValues,
        mode: "onChange",
    })

    function onSubmit(data: ProfileFormValues) {
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value ? [field.value] : []} 
                                    onChange={(url) => field.onChange(url)}
                                    onRemove={() => field.onChange('')}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Organisation Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Organisation name" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your registered business name which will appear in all the forms and payslips.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 space-x-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Organisation email" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This email address will receive the notification from Horizon
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile</FormLabel>
                                <FormControl>
                                    <Input placeholder="Organisation mobile" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This mobile number will used for KYC
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit">Update Profile</Button>
            </form>
        </Form>
    )
}