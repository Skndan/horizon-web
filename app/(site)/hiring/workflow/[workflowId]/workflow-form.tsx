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
import { useAuth } from "@/context/auth-provider"
import { Workflow } from "@/types/hiring"
import { Profile } from "@/types/profile"

const formSchema = z.object({
    organisation: z.any(),
    name: z.string().min(1)
});

type PositionFormValues = z.infer<typeof formSchema>

interface PositionFormProps {
    initialData: Workflow | null;
};

export const WorkflowForm: React.FC<PositionFormProps> = ({
    initialData
}) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<Profile[]>([])


    const title = initialData ? 'Edit Workflow' : 'Create Workflow';
    const description = initialData ? 'Update workflow' : 'Adding new workflow';
    const toastMessage = initialData ? 'Workflow updated' : 'Workflow created';
    const action = initialData ? 'Save changes' : 'Create';

    const { user } = useAuth(); 

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
                .put(`/workflow/${initialData.id}`, data)
                .then((res) => res.data)
                .then((data) => {
                    toast.success(toastMessage);
                    router.refresh();
                    router.push(`../workflow`);
                });
        } else {
            await apiClient
                .post("/workflow", data)
                .then((res) => res.data)
                .then((data) => {
                    toast.success(toastMessage);
                    router.refresh();
                    router.push(`../workflow`);
                });
        }
    };


    async function fetchData() {
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
                            <BreadcrumbLink href="/hiring/workflow">Workflow</BreadcrumbLink>
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Workflow Name" {...field} />
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