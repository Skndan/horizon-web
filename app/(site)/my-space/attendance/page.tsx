"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SubHeading } from "@/components/ui/sub-heading";
import { CalendarIcon, Loader, Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EmptyStateTable } from "@/components/common/empty-state-table";
import { DataTable } from "@/components/ui/data-table";
import { LeaveRequest } from "@/types/leave";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { useUpdateStore } from "@/store/use-update-store";
import Link from "next/link";
import { columns } from "./columns";
import { Daylog } from "@/types/attendance";
import { useAuth } from "@/context/auth-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { TimePicker } from "@/components/ui/time-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import { Calendar } from "@/components/ui/calendar";
import toast from "react-hot-toast";
import { timeObjectToString } from "@/lib/utils/time-utils";

const formSchema = z.object({
    setDate: z.any(),
    setTime: z.any(),
    reason: z.string().min(1),
    profile: z.any(),
});

type DepartmentFormValues = z.infer<typeof formSchema>;

const MySpaceAttendancePage = () => {

    const [data, setData] = useState<Daylog[]>([])
    const [loading, setFormLoading] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [isOpen, setOpen] = useState(false);
    const { user } = useAuth();


    const form = useForm<DepartmentFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profile: {
                id: ""
            }
        },
        mode: "onChange",
    });


    async function fetchData() {
        setLoading(true)
        await apiClient.get(`/time-sheet/day-log-by-profile/day-wise/${user?.profileId}`).then((res) => res.data)
            .then((data) => {
                setData(data)
                setLoading(false)
            });
    }
    const { flag } = useUpdateStore();

    useEffect(() => {
        fetchData();
    }, [flag])


    const onSubmit = async (data: DepartmentFormValues) => {
        try {
            setFormLoading(true);
            
            data.profile.id = user?.profileId;
            data.setTime = timeObjectToString(data.setTime);

            await apiClient
                .post("/attendance", data)
                .then((res) => res.data)
                .then((data) => {
                    toast.success("Request submitted");
                });
        } catch (error: any) {
            toast.error("Something went wrong.");
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <>




            <div>
                <div className="flex items-center justify-between">
                    <SubHeading title="Attendance" description="Your attendance record" />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" /> Adjust Log In Time
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Adjust Log in Time</DialogTitle>
                                <DialogDescription>
                                    Make change request to adjustment
                                </DialogDescription>
                            </DialogHeader> 
                            
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                                    <div className="grid gap-x-8 gap-y-4">
                                        <FormField
                                            control={form.control}
                                            name="setDate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col pt-2">
                                                    <FormLabel>Date</FormLabel>
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
                                                                    today={new Date()}
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
                                            name="setTime"
                                            disabled={loading}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Time <span className="text-red-600">*</span></FormLabel>
                                                    <FormControl>
                                                        <TimePicker {...field} />
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
                                                        <Input disabled={loading} placeholder="Reason" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button disabled={loading} className="ml-auto" type="submit">
                                            {loading &&
                                                <Loader className="animate-spin h-5 w-5 mr-3" />}
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                    {/* <Link href={`/my-space/attendance/manual`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Adjust Clock In
                        </Button>
                    </Link> */}
                </div>
                {isLoading ? (
                    <div className="grid h-screen place-items-center">
                        <Loader className="animate-spin h-5 w-5 mr-3" />
                    </div>
                ) :
                    (<>
                        <div className='flex flex-row gap-4'>
                            <div className="flex-1">
                                {
                                    data.length == 0 ?
                                        <EmptyStateTable
                                            title={"No request found"}
                                            description={"You have not request for leave. Add one below."}
                                            action={"Request Leave"}
                                            onClick={() => {
                                                setOpen(true);
                                            }} />
                                        : <DataTable searchKey="createdAt" columns={columns} data={data} />
                                }
                            </div>
                            {/* <div className="flex flex-col gap-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-md font-medium">
                                            Time Off Requests
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">#1</div>
                                        <p className="text-sm text-muted-foreground">
                                            Taken 1
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-md font-medium">
                                            Time Off Requests
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">#1</div>
                                    </CardContent>
                                </Card>
                            </div> */}
                        </div>
                    </>)
                }

            </div>
        </>)
}

export default MySpaceAttendancePage;