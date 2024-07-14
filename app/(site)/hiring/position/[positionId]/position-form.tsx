"use client"

import * as z from "zod"
import { useEffect, useState } from "react"
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
import { Position } from "@/types/hiring"
import { Address, Department, Profile } from "@/types/profile"

const formSchema = z.object({
    organisation: z.any(),
    title: z.any(),
    location: z.any(),
    hiringLead: z.any(),
    department: z.any(),
    employmentType: z.any(),
    minExperience: z.any(),
    ctc: z.any(),
    description: z.any(),
    code: z.any(),
    status: z.any()
});

type PositionFormValues = z.infer<typeof formSchema>

interface PositionFormProps {
    initialData: Position | null;
};

export const PositionForm: React.FC<PositionFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [department, setDepartment] = useState<Department[]>([])
    const [address, setAddress] = useState<Address[]>([])
    const [profile, setProfile] = useState<Profile[]>([])


    const title = initialData ? 'Edit Position' : 'Create Position';
    const description = initialData ? 'Update position.' : 'Adding new position';
    const toastMessage = initialData ? 'Position updated.' : 'Position created.';
    const action = initialData ? 'Save changes' : 'Create';

    const { user } = useAuth();

    const positionStatus = [
        {
            value: "HIRING",
            label: "Hiring",
        },
        {
            value: "CLOSED",
            label: "Closed",
        },
        {
            value: "HOLD",
            label: "Hold",
        }
    ]


    const employmentType = [
        {
            value: "FULL_TIME",
            label: "Full time",
        },
        {
            value: "PART_TIME",
            label: "Part time",
        },
        {
            value: "INTERN",
            label: "Intern",
        }
    ]

    const form = useForm<PositionFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            organisation: {
                id: ''
            }
        }
    });

    const onSubmit = async (data: PositionFormValues) => {

        setLoading(true);
        data.organisation.id = user?.orgId;

        if (initialData) {
            await apiClient
                .put(`/position/${initialData.id}`, data)
                .then((res) => res.data)
                .then((data) => {
                    toast.success(toastMessage);
                    router.refresh();
                    router.push(`../position`);
                });
        } else {
            await apiClient
                .post("/position", data)
                .then((res) => res.data)
                .then((data) => {
                    toast.success(toastMessage);
                    router.refresh();
                    router.push(`../position`);
                });
        }
    };


    async function fetchData() {
        await apiClient.get(`/department/get-by-org/${user?.orgId}`).then((res) => res.data)
            .then((data) => {
                setDepartment(data.content)
            });

        await apiClient.get(`/address/get-by-org/${user?.orgId}`).then((res) => res.data)
            .then((data) => {
                setAddress(data.content)
            });

        await apiClient.get(`/profile/get-by-org/${user?.orgId}`).then((res) => res.data)
            .then((data) => {
                setProfile(data.content)
            });

        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [])


    return (
        <>
            <div className="flex items-center justify-between">
                <SubHeading title={title} description={description} />
                <Breadcrumb className="sm:block hidden">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/hiring/position">Position</BreadcrumbLink>
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
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ctc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CTC <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="CTC" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="minExperience"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min. Experience <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Min. Experience" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Position Status <span className="text-red-600">*</span></FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select Status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {positionStatus.map((size) => (
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
                            name="department.id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department <span className="text-red-600">*</span></FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select Department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {department.map((size) => (
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
                            name="location.id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location <span className="text-red-600">*</span></FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select Location" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {address.map((size) => (
                                                <SelectItem key={size.id} value={size.id}>{size.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="employmentType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Employment Type <span className="text-red-600">*</span></FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select Employment Type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {employmentType.map((size) => (
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
                            name="hiringLead.id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hiring Manager</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select the Hiring Manager" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {profile.map((size) => (
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Textarea disabled={loading} placeholder="Description" {...field} />
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