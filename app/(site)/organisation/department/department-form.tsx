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
import { Department } from "@/types/profile";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/auth-provider";

interface DepartmentFormProps {
    initialData: Department | null;
    isOpen: boolean;
    onClose: () => void;
}

const formSchema = z.object({
    name: z.string().min(1),
    code: z.string().min(1),
    organisation: z.object({
        id: z.any()
    })
});

type DepartmentFormValues = z.infer<typeof formSchema>;

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
    initialData,
    isOpen,
    onClose,
}) => {
    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    const onSubmit = async (data: DepartmentFormValues) => {
        try {
            setLoading(true);

            data.organisation.id = user?.orgId;

            if (initialData) {
                await apiClient
                    .put(`/department/${initialData.id}`, data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        onClose();
                    });
            } else {
                await apiClient
                    .post("/department", data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        onClose();
                    });
            }
        } catch (error: any) {
            console.log(error)
            toast.error("Something went wrong.");
            onClose();
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const title = initialData ? "Edit department" : "Create department";
    const description = initialData ? "Edit a department." : "Add a new department";
    const toastMessage = initialData ? "Department updated." : "Department created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<DepartmentFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: formData || {
            organisation: {
                id: user?.orgId
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
                                        <FormLabel> {formData?.name}</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Department name"
                                                {...field}
                                            />
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
                                            <Input
                                                disabled={loading}
                                                placeholder="Department code"
                                                {...field}
                                            />
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
            </SheetContent>
        </Sheet>
    );
};
