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
import { Checkbox } from "@/components/ui/checkbox";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ComponentType } from "@/types/payroll";

interface ComponentTypeFormProps {
    initialData: ComponentType | null;
    isOpen: boolean;
    onClose: () => void;
}

const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    type: z.string(),
    fixed: z.boolean().optional(),
});

type ComponentTypeFormValues = z.infer<typeof formSchema>;

export const types = [
    {
        label: "Earning",
        value: "EARNING"
    },
    {
        label: "Deduction",
        value: "DEDUCTION"
    }
]

export const ComponentTypeForm: React.FC<ComponentTypeFormProps> = ({
    initialData,
    isOpen,
    onClose,
}) => {
    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: ComponentTypeFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await apiClient
                    .put(`/component-type/${initialData.id}`, data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        onClose();
                    });
            } else {
                await apiClient
                    .post("/component-type", data)
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

    const title = initialData ? "Edit type" : "Create type";
    const description = initialData ? "Edit a type." : "Add a new type";
    const toastMessage = initialData ? "Type updated." : "Type created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<ComponentTypeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: formData || {},
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
                                        <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                                        <FormLabel> {formData?.name}</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Description"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fixed"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Mark this as fixed
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select earning type" defaultValue={field.value} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {types.map((size) => (
                                                            <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
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
