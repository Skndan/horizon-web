"use client"

import * as z from "zod"
import axios from "axios"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Loader, Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
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
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlashIcon } from "@radix-ui/react-icons"
import { Country, State } from 'country-state-city';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Location } from "@/types/profile"
import apiClient from "@/lib/api/api-client"


const formSchema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    country: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1),
});

type LocationFormValues = z.infer<typeof formSchema>

interface LocationFormProps {
    initialData: Location | null;
};


export const LocationFormPage: React.FC<LocationFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit location' : 'Create Location';
    const description = initialData ? 'Edit a location.' : 'Add a new location';
    const toastMessage = initialData ? 'Location updated.' : 'Location created.';
    const action = initialData ? 'Save changes' : 'Create';

    const form = useForm<LocationFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {}
    });

    const onSubmit = async (data: LocationFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await apiClient
                    .put(`/location/${initialData.id}`, data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        router.refresh();
                        router.push(`../location`);
                    });
            } else {
                await apiClient
                    .post("/location", data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        router.refresh();
                        router.push(`../location`);
                    });
            }
        } catch (error: any) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const countryData = Country.getAllCountries().map(city => ({
        value: city.name,
        displayValue: city.name
    }))

    const stateData = State.getStatesOfCountry("IN").map(state => ({
        value: state.name,
        displayValue: state.name
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <Heading title={title} description={description} />
                    <Breadcrumb className="sm:block hidden">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/organisation/location">Location</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <SlashIcon />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbPage>Form</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    {/* {initialData && (
                        <Button
                            disabled={loading}
                            variant="destructive"
                            size="sm"
                            onClick={() => setOpen(true)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    )} */}
                </div>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                        <div className="grid md:grid-cols-3 gap-x-8 gap-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location name*</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Location name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Address" {...field} />

                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Select a country" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {countryData.map((category) => (
                                                    <SelectItem key={category.value} value={category.displayValue}>{category.displayValue}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Select a state" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {stateData.map((category) => (
                                                    <SelectItem key={category.value} value={category.displayValue}>{category.displayValue}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                            <Input disabled={loading} placeholder="Pincode" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button disabled={loading} className="ml-auto" type="submit">
                            {loading &&
                                <Loader className="animate-spin h-5 w-5 mr-3" />}
                            {action}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>)
}

export default LocationFormPage;