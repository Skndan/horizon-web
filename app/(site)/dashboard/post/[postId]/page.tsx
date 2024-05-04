"use client";

import * as z from "zod"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import Multiselect from 'multiselect-react-dropdown';
import { useRouter } from "next/navigation"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, SlashIcon } from "@radix-ui/react-icons"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import apiClient from "@/lib/api/api-client";
import { Profile } from "@/types/profile";


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from "@/context/auth-provider";

const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    startDate: z.any().optional(),
    dueDate: z.any().optional(),
    attendies: z.any().optional(),
    visibility: z.any().optional(),
    location: z.any().optional(),
    type: z.any().optional(),
    initiator: z.any().optional()
});

type EmployeeFormValues = z.infer<typeof formSchema>

const visibility = [
    {
        value: "PUBLIC",
        label: "Public",
    },
    {
        value: "PRIVATE",
        label: "Private",
    }
]

const type = [
    {
        value: "ACTIVITY",
        label: "Activity",
    },
    {
        value: "EVENT",
        label: "Event",
    }
]

const PostPage = ({ params }: { params: { postId: string } }) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const title = 'Create Post ✨';
    const description = 'Add a new post';
    const toastMessage = 'Post created.';
    const action = 'Create';

    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            initiator: { id: '' }
        }
    });

    const [profile, setProfile] = useState<Option[]>([])

    useEffect(() => {
        (async () => {
            setLoading(true);
            const profiles = await apiClient.get(`/profile`);

            const holidayDates = profiles.data.content.filter((profile: Profile) => profile.active).map((profile: Profile) => {
                return {
                    label: profile.name, value: profile.id
                };
            });
            setProfile(holidayDates);
            setLoading(false);
        })()
    }, [])

    const onSubmit = async (data: EmployeeFormValues) => {
        try {

            data.initiator.id = user?.profileId;

            const profile: Profile = data.attendies.map((option: Option) => {
                return {
                    id: option.value
                };
            });

            data.attendies = profile;

            setLoading(true);
            await apiClient
                .post("/activity", data)
                .then((res) => res.data)
                .then((data) => {
                    toast.success(toastMessage);
                    router.push(`/dashboard`);
                });
        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                <Breadcrumb className="sm:block hidden">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
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

            {loading ? (
                <div className="grid h-screen place-items-center">
                    <Loader className="animate-spin h-5 w-5 mr-3" />
                </div>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">



                        <div className="grid md:grid-cols-3 gap-x-8 gap-y-4">

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event/Activity Name <span className="text-red-600">*</span></FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location <span className="text-red-600">*</span></FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Location address or Online" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Visibility</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Select visibility" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {visibility.map((category) => (
                                                    <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {type.map((category) => (
                                                    <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="attendies"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Attendies</FormLabel>
                                        <MultipleSelector disabled={loading}
                                            onChange={field.onChange}
                                            value={field.value}
                                            defaultOptions={profile}
                                            placeholder="Select the attendies..."
                                            emptyIndicator={
                                                <p className="text-center text-lg leading-10">
                                                    no results found.
                                                </p>
                                            }
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col pt-2">
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button disabled={loading}
                                                            variant={"outline"}
                                                            className={cn(
                                                                "pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        captionLayout="dropdown-buttons"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        fromYear={1970}
                                                        toYear={new Date().getFullYear()}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col pt-2">
                                        <FormLabel>Due Date</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button disabled={loading}
                                                            variant={"outline"}
                                                            className={cn(
                                                                "pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        captionLayout="dropdown-buttons"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        fromYear={1970}
                                                        toYear={new Date().getFullYear()}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>


                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <ReactQuill 
                                            value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button disabled={loading} className="ml-auto" type="submit">
                            {loading &&
                                <Loader className="animate-spin h-5 w-5 mr-3" />}
                            {action}
                        </Button>
                    </form>
                </Form>
            )}
        </div>)
}

export default PostPage;