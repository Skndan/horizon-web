"use client"

import * as z from "zod"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { CheckIcon, Loader } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CaretSortIcon, SlashIcon } from "@radix-ui/react-icons"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
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
import { Candidate, Interview, Workflow } from "@/types/hiring"
import { Address, Department, Profile } from "@/types/profile"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';
import { cn } from "@/lib/utils"

const formSchema = z.object({
    candidate: z.any(),
    workflow: z.any(),
});


const languages = [
    { label: "English", value: "en" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Spanish", value: "es" },
    { label: "Portuguese", value: "pt" },
    { label: "Russian", value: "ru" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
    { label: "Chinese", value: "zh" },
] as const


type InterviewFormValues = z.infer<typeof formSchema>

interface InterviewFormProps {
    initialData: Interview | null;
};

export const InterviewForm: React.FC<InterviewFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [candidate, setCandidate] = useState<Candidate[]>([])
    const [workflow, setWorkflow] = useState<Workflow[]>([])


    const title = initialData ? 'Edit Interview' : 'Create Interview';
    const description = initialData ? 'Update interview.' : 'Adding new interview';
    const toastMessage = initialData ? 'Interview updated.' : 'Interview created.';
    const action = initialData ? 'Save changes' : 'Create';

    const { user } = useAuth();

    const form = useForm<InterviewFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            candidate: {
                id: ''
            },
            workflow: {
                id: ''
            }
        }
    });

    const onSubmit = async (data: InterviewFormValues) => {

        setLoading(true);

        if (initialData) {
            await apiClient
                .put(`/interview/${initialData.id}`, data)
                .then((res) => res.data)
                .then((data) => {
                    toast.success(toastMessage);
                    router.refresh();
                    router.push(`../interview`);
                });
        } else {
            await apiClient
                .post("/interview", data)
                .then((res) => res.data)
                .then((data) => {
                    toast.success(toastMessage);
                    router.refresh();
                    router.push(`../interview`);
                });
        }
    };


    async function fetchData() {
        await apiClient.get(`/workflow/get-by-org/${user?.orgId}`).then((res) => res.data)
            .then((data) => {
                setWorkflow(data.content)
            });

        await apiClient.get(`/candidate/get-by-org/${user?.orgId}`).then((res) => res.data)
            .then((data) => {
                setCandidate(data.content)
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
                            <BreadcrumbLink href="/hiring/interview">Interview</BreadcrumbLink>
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
                            name="candidate.id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-2">
                                    <FormLabel>Language</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "justify-between mt-1",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? languages.find(
                                                            (language) => language.value === field.value
                                                        )?.label
                                                        : "Select language"}
                                                    <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search candidate..."
                                               
                                                />
                                                <CommandList>
                                                    <CommandEmpty>No candidate found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {languages.map((language) => (
                                                            <CommandItem
                                                                value={language.label}
                                                                key={language.value}
                                                                onSelect={() => {
                                                                    form.setValue("candidate.id", language.value)
                                                                }}
                                                            >
                                                                {language.label}
                                                                <CheckIcon
                                                                    className={cn(
                                                                        "ml-auto h-4 w-4",
                                                                        language.value === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {/* <FormDescription>
                                        This is the language that will be used in the dashboard.
                                    </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* <FormField
                            control={form.control}
                            name="candidate.id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Candidate <span className="text-red-600">*</span></FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select Candidate" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {candidate.map((size) => (
                                                <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

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