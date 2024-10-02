"use client"

import * as z from "zod"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { CalendarIcon, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlashIcon } from "@radix-ui/react-icons"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SubHeading } from "@/components/ui/sub-heading"
import apiClient from "@/lib/api/api-client"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/auth-provider"
import { Candidate, Interview, Position, Workflow } from "@/types/hiring"
import { AlertModal } from "@/components/modals/alert-modal"
import { Label } from "@/components/ui/label"
import { TimePicker } from "@/components/ui/time-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { timeObjectToString } from "@/lib/utils/time-utils"

const formSchema = z.object({
    organisation: z.any(),
    position: z.any(),
    name: z.any(),
    email: z.any(),
    mobile: z.any(),
    source: z.any(),
    refer: z.any(),
    file: z.any()
});


const interviewSchema = z.object({
    workflow: z.any(),
    candidate: z.any(),
    interviewDate: z.any(),
    startTime: z.any(),
    endTime: z.any(),
});


type CandidateFormValues = z.infer<typeof formSchema>
type InterviewFormValues = z.infer<typeof interviewSchema>

interface CandidateFormProps {
    initialData: Candidate | null;
};

export const CandidateForm: React.FC<CandidateFormProps> = ({
    initialData
}) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit Candidate' : 'Create Candidate';
    const description = initialData ? 'Update your candidate.' : 'Adding new candidate';
    const toastMessage = initialData ? 'Candidate updated.' : 'Candidate created.';
    const action = initialData ? 'Save changes' : 'Create';

    const { user } = useAuth();

    const [data, setData] = useState<Position[]>([])
    const [workflow, setWorkflow] = useState<Workflow[]>([])
    const [open, setOpen] = useState(false);
    const [candidate, setCandidate] = useState<Candidate | null>(null);

    const source = [
        {
            value: "LINKED_IN",
            label: "LinkedIn",
        },
        {
            value: "HIRIST",
            label: "Hirist",
        },
        {
            value: "INDEED",
            label: "Indeed",
        },
        {
            value: "NAUKRI",
            label: "Naukri",
        },
        {
            value: "GLASSDOOR",
            label: "Glassdoor",
        },
        {
            value: "FOUND_IT",
            label: "FoundIt",
        },
        {
            value: "HIRECT",
            label: "Hirect",
        },
        {
            value: "CUTSHORT",
            label: "Cutshort",
        },
        {
            value: "THROUGH_CONNECTIONS",
            label: "Connections",
        },
        {
            value: "OTHERS",
            label: "Others",
        }
    ]

    async function fetchData() {
        await apiClient.get(`/position/get-by-org/${user?.orgId}`).then((res) => res.data)
            .then((data) => {
                setData(data.content)
            });

        await apiClient.get(`/workflow/get-by-org/${user?.orgId}`).then((res) => res.data)
            .then((data) => {
                setWorkflow(data.content)
            });

        setLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, [])

    const form = useForm<CandidateFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            organisation: {
                id: ''
            },
            position: {
                id: ''
            }
        }
    });

    const interviewForm = useForm<InterviewFormValues>({
        resolver: zodResolver(interviewSchema),
        defaultValues: {}
    });

    const fileRef = form.register('file', { required: true });

    const onSubmit = async (data: CandidateFormValues) => {
        // try {

        setLoading(true);
        data.organisation.id = user?.orgId;

        var dd = {
            organisation: {
                id: user?.orgId
            },
            position: {
                id: data.position.id
            },
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            source: data.source,
            refer: data.refer
        };

        var formData = new FormData();
        formData.append('data', JSON.stringify(dd));

        formData.append("file", data.file);

        if (initialData) {
            await apiClient
                .put(`/candidate/${initialData.id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                .then((res) => res.data)
                .then((data) => {
                    setLoading(false);
                    toast.success(toastMessage);
                    router.refresh();
                    router.push(`../candidate`);
                });
        } else {
            await apiClient
                .post<Candidate>("/candidate", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                .then((res) => res.data)
                .then((data) => {
                    setLoading(false);
                    toast.success(toastMessage);
                    setCandidate(data);
                    setOpen(true);
                    // router.refresh();
                    // router.push(`../candidate`);
                }).catch(error => {
                    // Handle errors
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        if (error.response.status === 400) {
                            // Inform the user about the bad request
                            // alert('Bad request. Please check your input.');
                            toast.error(error.response.data.error);
                        } else {
                            // For other errors, log the error message

                        }
                    } else {
                        // The request was made but no response was received

                    }
                });
        }

        // } catch (error: any) {
        //     toast.error('Something went wrong.');
        // } finally {
        //     setLoading(false);
        // }
    };

    const onSubmit2 = async (data: InterviewFormValues) => {
        try {

            data.candidate = {
                "id": candidate?.id,
                "applicationNumber": candidate?.applicationNumber
            }
            data.startTime = timeObjectToString(data.startTime);
            data.endTime = timeObjectToString(data.endTime);

            await apiClient
                .post<Interview>("/interview", data)
                .then((res) => res.data)
                .then((data) => {
                  
                    toast.success(toastMessage);
                    setOpen(false);
                    router.refresh();
                    router.push(`../candidate`);
                }).catch(error => {
                    // Handle errors
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        if (error.response.status === 400) {
                            // Inform the user about the bad request
                            // alert('Bad request. Please check your input.');
                            toast.error(error.response.data.error);
                        } else {
                            // For other errors, log the error message
                        }
                    } else {
                        // The request was made but no response was received
                    }
                });
        } catch (error) {
            console.log(error);
            toast.error('Make sure you re-assign all employees using this department first.');
        } finally {
            setOpen(false);
            setLoading(false);
        }
    };

    const handleTimeRangeChange = (timeRange: string) => {
        console.log(`Selected time range: ${timeRange}`);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={(s)=>setOpen(false)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Schedule Interview</DialogTitle>
                        <DialogDescription>
                            {`Make changes to your profile here. Click save when you're done.`}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...interviewForm}>
                        <form onSubmit={interviewForm.handleSubmit(onSubmit2)} className="space-y-4 w-full">
                            <FormField
                                control={interviewForm.control}
                                name="workflow.id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Workflow <span className="text-red-600">*</span></FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Select the workflow" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {workflow.map((size) => (
                                                    <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={interviewForm.control}
                                name="interviewDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Interview Date</FormLabel>
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
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    fromDate={new Date()}
                                                    toYear={new Date().getFullYear()}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Your date of birth is used to calculate your age.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={interviewForm.control}
                                    name="startTime"
                                    disabled={loading}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>From Time <span className="text-red-600">*</span></FormLabel>
                                            <FormControl>
                                                <TimePicker {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={interviewForm.control}
                                    name="endTime"
                                    disabled={loading}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>To Time <span className="text-red-600">*</span></FormLabel>
                                            <FormControl>
                                                <TimePicker {...field} />
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
                </DialogContent>
            </Dialog>

            <div className="flex items-center justify-between">
                <SubHeading title={title} description={description} />
                <Breadcrumb className="sm:block hidden">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/hiring/candidate">Candidate</BreadcrumbLink>
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
                            name="position.id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Position <span className="text-red-600">*</span></FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select the position" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {data.map((size) => (
                                                <SelectItem key={size.id} value={size.id}>{size.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Candidate name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mobile <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Mobile" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="source"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Source <span className="text-red-600">*</span></FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select the source" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {source.map((size) => (
                                                <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Resume <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="file" disabled={loading}
                                                {...fileRef}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="refer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Textarea disabled={loading} placeholder="Candidate notes" {...field} />
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