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
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Holiday } from "@/types/holiday";
import apiClient from "@/lib/api/api-client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";

interface HolidayFormProps {
    initialData: Holiday | null;
    isOpen: boolean;
    onClose: () => void;
}

// name
// from
// to

const formSchema = z.object({
    name: z.string().min(1),
    holiday: z.any().optional(),
    organisation: z.any().optional(),
});

type HolidayFormValues = z.infer<typeof formSchema>;

export const HolidayForm: React.FC<HolidayFormProps> = ({
    initialData,
    isOpen,
    onClose,
}) => {
    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState(false);

    // const orgId = localStorage.getItem("orgId");

    const onSubmit = async (data: HolidayFormValues) => {
        try {
            setLoading(true);

            data.organisation.id = "orgId";

            console.log(data);
            if (initialData) {
                await apiClient
                    .put(`/holiday/${initialData.id}`, data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        onClose();
                    });
            } else {
                await apiClient
                    .post("/holiday", data)
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

    const title = initialData ? "Edit holiday" : "Create holiday";
    const description = initialData ? "Edit a holiday." : "Add a new holiday";
    const toastMessage = initialData ? "Holiday updated." : "Holiday created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<HolidayFormValues>({
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
                                        <FormLabel>Name*</FormLabel>
                                        <FormLabel> {formData?.name}</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Holiday name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="holiday"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col pt-2">
                                        <FormLabel>Holiday*</FormLabel>
                                        <FormControl>
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
                                                <PopoverContent align="start" className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        captionLayout="dropdown-buttons"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        fromYear={1970}
                                                        toYear={new Date().getFullYear()}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {/* <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="date"
                                                        variant={"outline"}
                                                        className={cn(
                                                            "justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value?.from ? (
                                                            field.value.to ? (
                                                                <>
                                                                    {format(field.value.from, "LLL dd, y")} -{" "}
                                                                    {format(field.value.to, "LLL dd, y")}
                                                                </>
                                                            ) : (
                                                                format(field.value.from, "LLL dd, y")
                                                            )
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        initialFocus
                                                        mode="single"
                                                        defaultMonth={field.value?.from}
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        numberOfMonths={2}
                                                    />
                                                </PopoverContent>
                                            </Popover> */}
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
