"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Loader } from "lucide-react"
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
import { CalendarIcon, SlashIcon } from "@radix-ui/react-icons"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Profile } from "@/types/profile"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { SubHeading } from "@/components/ui/sub-heading"
import apiClient from "@/lib/api/api-client"
import { LeaveRequest, LeaveType } from "@/types/leave"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/auth-provider"

const formSchema = z.object({
    profile: z.any(),
    leaveType: z.any(),
    startDate: z.any(),
    endDate: z.any(),
    status: z.any(),
    date: z.object({
        from: z.date().optional(),
        to: z.date().optional(),
    }, { required_error: "Timeline is required." }).refine((date) => {
        return !!date.from;
    }, "Timeline is required."),
});

type TimesheetFormValues = z.infer<typeof formSchema>

interface TimesheetFormProps {
    initialData: LeaveRequest | null;
    leaveType: LeaveType[];
};

export const TimesheetForm: React.FC<TimesheetFormProps> = ({
    initialData,
    leaveType
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit Leave Request' : 'Create Leave Request';
    const description = initialData ? 'Update your leave request.' : 'Request leave to your reporting manager';
    const toastMessage = initialData ? 'Leave request updated.' : 'Leave request created.';
    const action = initialData ? 'Save changes' : 'Create';

    const { user } = useAuth();

    const form = useForm<TimesheetFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            profile: {
                id: ''
            },
            date: {
                from: undefined,
                to: undefined,
            },
        }
    });

    const onSubmit = async (data: TimesheetFormValues) => {
        // try {

        setLoading(true);

        data.profile.id = user?.profileId;

        console.log(data);
        if (initialData) {
            await apiClient
                .put(`/leave-request/${initialData.id}`, data)
                .then((res) => res.data)
                .then((data) => {
                    toast.success(toastMessage);
                    router.refresh();
                    router.push(`../leave-request`);
                });
        } else {
            await apiClient
                .post("/leave-request", data)
                .then((res) => res.data)
                .then((data) => {
                    toast.success(toastMessage);
                    router.refresh();
                    router.push(`../leave-request`);
                });
        }

        // } catch (error: any) {
        //     toast.error('Something went wrong.');
        // } finally {
        //     setLoading(false);
        // }
    };

    const onChange = async (e: any) => {
        if (e) {
            if (e.from && e.to) {
                console.log(e.from)
                console.log(e.to)
                console.log("Call api");

                
            }
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <SubHeading title={title} description={description} />
                <Breadcrumb className="sm:block hidden">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/my-space/leave-request">Leave Request</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <SlashIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Form</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

                    <div className="grid md:grid-cols-3 gap-x-8 gap-y-4">

                        <FormField
                            control={form.control}
                            name='date'
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date Range</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="date"
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.value.from && "text-muted-foreground"
                                                )}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value.from ? (
                                                    field.value.to ? (
                                                        <>
                                                            {format(field.value.from, "LLL dd, y")} -{" "}
                                                            {format(field.value.to, "LLL dd, y")}
                                                        </>
                                                    ) : (
                                                        format(field.value.from, "LLL dd, y")
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                initialFocus
                                                mode="range"
                                                defaultMonth={field.value.from}
                                                selected={{ from: field.value.from!, to: field.value.to }}
                                                onSelect={(e) => {
                                                    field.onChange(e);
                                                    onChange(e);
                                                }}
                                                numberOfMonths={2}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        The date range, you want to submit timesheet for.
                                    </FormDescription>
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
        </>
    );
}; 