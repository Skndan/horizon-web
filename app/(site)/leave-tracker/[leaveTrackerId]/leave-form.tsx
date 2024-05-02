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
    reason: z.any(),
});

type LeaveRequestFormValues = z.infer<typeof formSchema>

interface LeaveRequestFormProps {
    initialData: LeaveRequest | null;
    leaveType: LeaveType[];
};

export const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
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

    const {user} = useAuth();

    const form = useForm<LeaveRequestFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            profile: {
                id: ''
            }
        }
    });

    const onSubmit = async (data: LeaveRequestFormValues) => {
        // try {

        setLoading(true); 
        data.profile.id = user?.profileId;

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

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success('Product deleted.');
        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
            setOpen(false);
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
                            name="leaveType.id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Leave Type <span className="text-red-600">*</span></FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select the shift" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {leaveType.map((size) => (
                                                <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col pt-2">
                                    <FormLabel>Start Date <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
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
                            name="endDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col pt-2">
                                    <FormLabel>End Date <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
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
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Textarea disabled={loading} placeholder="Reson for your leave request" {...field} />
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
        </>
    );
}; 