"use client"

import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Loader } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import { useAuth } from "@/context/auth-provider"
import { Daylog, Timesheet } from "@/types/attendance"
import { formatDate } from "date-fns/format"


// dayLogs: z.array(
//   z.object({
//       id: z.any(),
//       totalWork: z.any(),
//       totalBreak: z.any(),
//       status: z.any(),
//       endTime: z.any(),
//   })
// ),
// profile: z.any(),
// fromDate: z.any(),
// toDate: z.any(),
// workHours: z.any(),
// totalWork: z.any(),
// totalBreak: z.any(),

const formSchema = z.object({
    profile: z.any(),
    dayLogs: z.any().optional(),
    fromDate: z.any().optional(),
    toDate: z.any().optional(),
    date: z.object({
        from: z.date().optional(),
        to: z.date().optional(),
    }, { required_error: "Timeline is required." }).refine((date) => {
        return !!date.from;
    }, "Timeline is required."),
});

type TimesheetFormValues = z.infer<typeof formSchema>

interface TimesheetFormProps {
    initialData: Timesheet | null;
};

export const TimesheetForm: React.FC<TimesheetFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [dayLog, setDaylog] = useState<Daylog[]>([]);
    const [date, setDate] = useState({
        from: '',
        to: '',
    });
    const [cons, setCons] = useState({ totalBreak: 0, totalWork: 0 });

    const title = initialData ? 'Edit Timesheet' : 'Create Timesheet';
    const description = initialData ? 'Update your Timesheet.' : 'Submit your timesheet';
    const toastMessage = initialData ? 'Timesheet updated.' : 'Timesheet created.';
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
        data.fromDate = date.from;
        data.toDate = date.to;
        data.profile.id = user?.profileId;
        data.dayLogs = dayLog;
        console.log(data)

        await apiClient
            .post("/time-sheet", data)
            .then((res) => res.data)
            .then((data) => {
                toast.success(toastMessage);
                router.refresh();
                router.push(`../timesheet`);
            });

    };

    const onChange = async (e: any) => {
        if (e) {
            if (e.from && e.to) {

                setDate({ from: formatDate(e.from.toISOString(), "yyyy-MM-dd"), to: formatDate(e.to.toISOString(), "yyyy-MM-dd") });

                await apiClient
                    .get(`/time-sheet/fetch/${user?.profileId}/${formatDate(e.from.toISOString(), "yyyy-MM-dd")}/${formatDate(e.to.toISOString(), "yyyy-MM-dd")}`)
                    .then((res) => {
                        if (res.status === 200) {
                            setDaylog(res.data);
                            let w = 0;
                            let b = 0;
                            for (const day of res.data) {
                                w += day.totalWork;
                                b += day.totalBreak;
                            }
                            setCons({ totalBreak: b, totalWork: w })
                        }

                        if (res.status === 204) {
                            toast.error("You already have timesheet submitted for this time frame")
                        }
                    });
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
                            <BreadcrumbLink href="/my-space/timesheet">Timesheet</BreadcrumbLink>
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
                                                toDate={new Date()}
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

                    {dayLog.length === 0 ? <></> :

                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Clock In</TableHead>
                                        <TableHead>Clock Out</TableHead>
                                        <TableHead>Total Break Time</TableHead>
                                        <TableHead>Total Work Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dayLog.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>{format(log.createdAt, "PPP")}</TableCell>
                                            <TableCell>{format(log.createdAt, "hh:mm a")}</TableCell>
                                            <TableCell>{format(log.updatedAt, "hh:mm a")}</TableCell>
                                            <TableCell>{log.totalBreak}</TableCell>
                                            <TableCell>{log.totalWork}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-muted">
                                        <TableCell className="text-right" colSpan={3}>Total</TableCell>
                                        <TableCell>{cons.totalBreak} hrs</TableCell>
                                        <TableCell>{cons.totalWork} hrs</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                    }

                    <Button disabled={loading || dayLog.length === 0} className="ml-auto" type="submit">
                        {loading &&
                            <Loader className="animate-spin h-5 w-5 mr-3" />}
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
}; 