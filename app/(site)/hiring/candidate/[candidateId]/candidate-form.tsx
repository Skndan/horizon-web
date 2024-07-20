"use client"

import * as z from "zod"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
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
import { Candidate, Position } from "@/types/hiring"

const formSchema = z.object({
    organisation: z.any(),
    name: z.any(),
    email: z.any(),
    mobile: z.any(),
    canRelocate: z.any(),
    source: z.any(),
    refer: z.any(),
    position: z.any(),
});

type CandidateFormValues = z.infer<typeof formSchema>

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
                setLoading(false)
            });
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

    const onSubmit = async (data: CandidateFormValues) => {
        // try {

        setLoading(true);
        data.organisation.id = user?.orgId;

        if (initialData) {
            await apiClient
                .put(`/candidate/${initialData.id}`, data)
                .then((res) => res.data)
                .then((data) => {
                    toast.success(toastMessage);
                    router.refresh();
                    router.push(`../candidate`);
                });
        } else {
            await apiClient
                .post("/candidate", data)
                .then((res) => res.data)
                .then((data) => {
                    toast.success(toastMessage);
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
        }

        // } catch (error: any) {
        //     toast.error('Something went wrong.');
        // } finally {
        //     setLoading(false);
        // }
    };
    return (
        <>
            <div className="flex items-center justify-between">
                <SubHeading title={title} description={description} />
                <Breadcrumb className="sm:block hidden">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/my-space/leave-request">Candidate</BreadcrumbLink>
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