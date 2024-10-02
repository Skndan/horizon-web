"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import * as z from "zod";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Designation } from "@/types/profile";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/auth-provider";

interface DesignationFormProps {
    initialData: Designation | null;
    isOpen: boolean;
    onClose: () => void;
}

const formSchema = z.object({
    name: z.string().min(1),
    level: z.string().min(1),
    organisation: z.any().optional(),
});

type DesignationFormValues = z.infer<typeof formSchema>;

export const DesignationForm: React.FC<DesignationFormProps> = ({
    initialData,
    isOpen,
    onClose,
}) => {
    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const level = [
        {
            value: "INTERN",
            label: "Intern",
        },
        {
            value: "JUNIOR",
            label: "Junior",
        },
        {
            value: "SENIOR",
            label: "Senior",
        },
        {
            value: "ASSOCIATE",
            label: "Associate",
        },
        {
            value: "LEAD",
            label: "Lead",
        },
        {
            value: "MANAGER",
            label: "Manager",
        },
        {
            value: "CHIEF",
            label: "Chief",
        },
        {
            value: "DIRECTOR",
            label: "Director",
        },
        {
            value: "GENERIC",
            label: "Generic",
        }
    ]

    const onSubmit = async (data: DesignationFormValues) => {
        try {
            setLoading(true);

            data.organisation.id = user?.orgId;

            if (initialData) {
                await apiClient
                    .put(`/designation/${initialData.id}`, data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        onClose();
                    });
            } else {
                await apiClient
                    .post("/designation", data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        onClose();
                    });
            }
        } catch (error: any) {
            toast.error("Something went wrong.");
            onClose();
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const title = initialData ? "Edit designation" : "Create designation";
    const description = initialData ? "Edit a designation." : "Add a new designation";
    const toastMessage = initialData ? "Designation updated." : "Designation created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<DesignationFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: formData || {
            organisation: {
                id: ''
            }
        },
        mode: "onChange",
    });

    return (
        <Sheet key="right" open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 w-full">
                        <div className="md:grid md:grid-cols-1 gap-4 pt-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name <span className="text-red-600">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Designation name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Seniority <span className="text-red-600">*</span></FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select the seniority" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {level.map((level) => (
                                                <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
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
            </SheetContent>
        </Sheet>
    );
};
