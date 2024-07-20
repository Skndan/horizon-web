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
import { useAuth } from "@/context/auth-provider"
import { WorkflowLine } from "@/types/hiring"
import { Profile } from "@/types/profile"

const formSchema = z.object({
    workflow: z.any(),
    transitionName: z.any(),
    transitionLevel: z.any(),
    sendEmail: z.any(),
    approver: z.any()
});

type PositionFormValues = z.infer<typeof formSchema>

interface PositionFormProps {
    initialData: WorkflowLine | null;
    workflowId: String
};

export const WorkflowLineForm: React.FC<PositionFormProps> = ({
    initialData,
    workflowId
}) => {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile[]>([])


    const title = initialData ? 'Edit Workflow Step' : 'Create Workflow Step';
    const description = initialData ? 'Update workflow step' : 'Adding new workflow step';
    const toastMessage = initialData ? 'Workflow step updated' : 'Workflow step created';
    const action = initialData ? 'Save changes' : 'Create';

    const { user } = useAuth(); 

    const form = useForm<PositionFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            workflow: {
                id: workflowId
            }
        }
    });

    const onSubmit = async (data: PositionFormValues) => {

        setLoading(true);
        data.workflow.id = workflowId;

        if (initialData) {
            await apiClient
                .put(`/workflow-line/${initialData.id}`, data)
                .then((res) => res.data)
                .then((data) => {
                    toast.success(toastMessage);
                    router.refresh();
                    router.push(`../line`);
                });
        } else {
            await apiClient
                .post("/workflow-line", data)
                .then((res) => res.data)
                .then((data) => {
                    toast.success(toastMessage);
                    router.refresh();
                    router.push(`../line`);
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
                            name="transitionName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Transition Name <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Transition Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> 

                        <FormField
                            control={form.control}
                            name="approver.id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Interview Panel</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select the Interview Panel" />
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