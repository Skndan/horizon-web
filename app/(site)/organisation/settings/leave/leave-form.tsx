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
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { LeaveType } from "@/types/leave";
import { useAuth } from "@/context/auth-provider";

interface LeaveTypeFormProps {
    initialData: LeaveType | null;
    isOpen: boolean;
    onClose: () => void;
}

const formSchema = z.object({
    name: z.string().min(1),
    organisation: z.any(),
    count: z.any()
});

type LeaveTypeFormValues = z.infer<typeof formSchema>;

export const LeaveTypeForm: React.FC<LeaveTypeFormProps> = ({
    initialData,
    isOpen,
    onClose,
}) => {
    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();


    const onSubmit = async (data: LeaveTypeFormValues) => { 
        try {
            setLoading(true);

            data.organisation.id = user?.orgId;

            if (initialData) {
                await apiClient
                    .put(`/leave/type/${initialData.id}`, data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        onClose();
                    });
            } else {
                await apiClient
                    .post("/leave/type", data)
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

    const title = initialData ? "Edit Leave Type" : "Create Leave Type";
    const description = initialData ? "Edit a Leave Type." : "Add a new Leave Type";
    const toastMessage = initialData ? "Leave type updated." : "Leave type created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<LeaveTypeFormValues>({
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
                                        <FormLabel> {formData?.name}</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Leave type name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="count"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Leave <span className="text-red-600">*</span></FormLabel>
                                        <FormLabel> {formData?.name}</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Total Leave"
                                                 type={'number'}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <Button disabled={loading || !form.formState.isValid} className="ml-auto" type="submit">
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
