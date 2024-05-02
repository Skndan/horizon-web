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
import { Organisation } from "@/types/profile"
import { useState } from "react"
import apiClient from "@/lib/api/api-client"
import toast from "react-hot-toast"

const organisationFormSchema = z.object({
    name: z.string().min(1),
    email: z.string().min(1),
    mobile: z.string().min(1),
    type: z.any(),
})

type ProfileFormValues = z.infer<typeof organisationFormSchema>

interface OrganisationFormProps {
    initialData: Organisation;
};

export const OrganisationForm: React.FC<OrganisationFormProps> = ({
    initialData
}) => {



    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(organisationFormSchema),
        defaultValues: initialData || {},
        mode: "onChange",
    })

    const [loading, setLoading] = useState(false);

    async function onSubmit(data: ProfileFormValues) {
        try {
            setLoading(true);
            await apiClient
                .put(`/organisation/${initialData?.id}`, data)
                .then((res) => res.data)
                .then((data) => {
                    toast.success("Organisation profile updated");
                });
        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* <FormField
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
                /> */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Organisation Name {initialData.name}</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Organisation name" {...field} />
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
                                    <Input disabled={loading} placeholder="Organisation email" {...field} />
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
                                    <Input disabled={loading} placeholder="Organisation mobile" {...field} />
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