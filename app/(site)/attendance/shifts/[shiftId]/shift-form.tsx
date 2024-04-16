"use client"

import * as z from "zod"
import { useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
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
import { Heading } from "@/components/ui/heading"
import { SlashIcon } from "@radix-ui/react-icons"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const formSchema = z.object({
    name: z.string().min(1),
    startTime: z.any(),
    endTime: z.any(),
    isDynamic: z.boolean().optional(),
    workDays: z.any(),
    schedules: z.any()
});

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Checkbox } from "@/components/ui/checkbox"
import { TimePicker } from "@/components/ui/time-picker"
import { stringToTimeObject, timeObjectToString } from "@/lib/utils/time-utils"
import { Shift } from "@/types/attendance"
import apiClient from "@/lib/api/api-client"
import { Loader } from "lucide-react"

type ShiftFormValues = z.infer<typeof formSchema>

interface ShiftFormProps {
    initialData: Shift | null;
};

export const ShiftForm: React.FC<ShiftFormProps> = ({
    initialData
}) => {

    const router = useRouter();

    const [dynamic, setDynamic] = useState(false);
    const [loading, setLoading] = useState(false);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeks = ['1st Week', '2nd Week', '3rd Week', '4th Week', '5th Week'];

    const title = initialData ? 'Edit shift ✨' : 'Create Shift ✨';
    const description = initialData ? 'Edit a shift.' : 'Add a new shift';
    const toastMessage = initialData ? 'Shift updated.' : 'Shift created.';
    const action = initialData ? 'Save changes' : 'Create';

    const form = useForm<ShiftFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...initialData,
            startTime: stringToTimeObject(initialData?.startTime),
            endTime: stringToTimeObject(initialData?.endTime),
        } || {
            isDynamic: false,
            // schedules: weeks.map((week, index) => ({ // Assuming 'weeks' is accessible here, otherwise define it similarly to ShiftSchedule
            //     weekNumber: index + 1,
            //     workDays: [] // Empty array as default, no days selected
            // })),
        }
    });

    const formRef = useRef<HTMLFormElement>(null);


    const onChangeCheckBox = (checked: any) => {
        setDynamic((prev) => (prev = checked));
    };

    const onSubmit = async (data: ShiftFormValues) => {

        try {

            //   "startTime": "13:45:30.123456789",
            //   "endTime": "13:45:30.123456789", 
            data.startTime = timeObjectToString(data.startTime);
            data.endTime = timeObjectToString(data.endTime);


            // console.log(data);
            setLoading(true);

            if (initialData) {
                await apiClient
                    .put(`/shift/${initialData.id}`, data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        router.refresh();
                        router.push(`../shifts`);
                    });
            } else {
                await apiClient
                    .post("/shift", data)
                    .then((res) => res.data)
                    .then((data) => {
                        toast.success(toastMessage);
                        router.refresh();
                        router.push(`../shifts`);
                    });
            }

        } catch (error: any) {
            // console.log(error);
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    // Submit handler
    const handleSubmit = (event: any) => {

        event.preventDefault();


        // Initialize an object to store the form data
        let formData: any = {};

        // Populate the formData with weeks as keys and empty arrays as values
        weeks.forEach((week, weekIndex) => {
            formData[`${weekIndex + 1}`] = []; // Adjusted for a 1-based index in the JSON keys
        });

        // Extract checkbox values and organize them into the formData object
        days.forEach((day, dayIndex) => {
            weeks.forEach((_, weekIndex) => {
                const checkBoxId = `checkbox-${dayIndex}-${weekIndex}`;
                if (event.target[checkBoxId].checked) {
                    // Shorten day names for JSON output and add them to the respective week
                    let shortDay = day.substring(0, 3).toUpperCase(); // Converts 'Monday' to 'mon', etc.
                    formData[`${weekIndex + 1}`].push(shortDay);
                }
            });
        });

        // Convert formData to JSON format
        // console.log(JSON.stringify(formData));
    };


    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                <Breadcrumb className="sm:block hidden">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/attendance/shifts">Shift</BreadcrumbLink>
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
                                        <Input disabled={loading} placeholder="Employee name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <span className="inline-grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startTime"
                                disabled={loading}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>From Time <span className="text-red-600">*</span></FormLabel>
                                        <FormControl>
                                            <TimePicker {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endTime"
                                disabled={loading}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>To Time <span className="text-red-600">*</span></FormLabel>
                                        <FormControl>
                                            <TimePicker {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </span>

                        {/* <FormField
                            control={form.control}
                            name="isDynamic"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-56">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(s) => {
                                                field.onChange(s);
                                                onChangeCheckBox(s);
                                            }}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Is dynamic shift?
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        /> */}
                        <FormField
                            control={form.control}
                            name="workDays"
                            disabled={loading}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Work Days</FormLabel>
                                    <FormControl>
                                        <ToggleGroup type="multiple" className="justify-start" variant="outline" {...field} value={field.value} onValueChange={field.onChange}>
                                            <ToggleGroupItem value="SUN">SUN</ToggleGroupItem>
                                            <ToggleGroupItem value="MON">MON</ToggleGroupItem>
                                            <ToggleGroupItem value="TUE">TUE</ToggleGroupItem>
                                            <ToggleGroupItem value="WED">WED</ToggleGroupItem>
                                            <ToggleGroupItem value="THU">THU</ToggleGroupItem>
                                            <ToggleGroupItem value="FRI">FRI</ToggleGroupItem>
                                            <ToggleGroupItem value="SAT">SAT</ToggleGroupItem>
                                        </ToggleGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* {!dynamic ? <p></p> : 
                            <div className="rounded-md border">
                                <form ref={formRef} onSubmit={handleSubmit}> 
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Day / Week</TableHead>
                                                {weeks.map((week, index) => (
                                                    <TableHead key={index}>{week}</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {days.map((day, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{day}</TableCell>
                                                    {weeks.map((_, weekIndex) => (
                                                        <TableCell key={weekIndex}>
                                                            <Input
                                                                type="checkbox"
                                                                id={`checkbox-${index}-${weekIndex}`}
                                                                name={`checkbox-${index}-${weekIndex}`}
                                                            />
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table> 
                                </form>   </div>
                        } */}
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
