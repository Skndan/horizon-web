"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
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
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Info, Trash } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const profileFormSchema = z.object({
    name: z
        .string(),
    description: z
        .string(),
    earnings: z.any(),
    deduction: z.any()
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
    earnings: [],
    deduction: []
}

export function TemplateForm() {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    })

    const {
        fields: fieldsList1,
        remove: removeList1,
        append: appendList1 } = useFieldArray({
            name: "earnings",
            control: form.control,
        })

    const {
        fields: fieldsList2,
        remove: removeList2,
        append: appendList2 } = useFieldArray({
            name: "deduction",
            control: form.control,
        })

    function onSubmit(data: ProfileFormValues) {
        toast.success(JSON.stringify(data));
    }

    return (
        <TooltipProvider>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex-2">
                                    <FormLabel>Template Name <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <div className=" rounded-md border first:flex flex-col md:flex-row gap-4 items-center p-4 my-4">
                            <Label>Annual CTC</Label>
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="shadcn" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <Label>per year</Label>
                            <Label className="flex-1 text-muted-foreground">This CTC will not be saved in the template, you can validate the earning and deduction distributions</Label>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Salary Components</TableHead>
                                        <TableHead>Calculation type</TableHead>
                                        <TableHead>Monthly Amount</TableHead>
                                        <TableHead>Annual Amount</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>

                                    {fieldsList1.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`earnings.${index}.id`}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue defaultValue={field.value} placeholder="Select a department" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="m@example.com">m@example.com</SelectItem>
                                                                <SelectItem value="m@google.com">m@google.com</SelectItem>
                                                                <SelectItem value="m@support.com">m@support.com</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`earnings.${index}.value`}
                                                    render={({ field }) => (
                                                        <FormItem>

                                                            <FormControl>
                                                                <Input placeholder="Employee Office Email" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Label>
                                                    Monthly Amount
                                                </Label>
                                            </TableCell>
                                            <TableCell>
                                                <Label>
                                                    Yearly Amount
                                                </Label>
                                            </TableCell>
                                            <TableCell>
                                                <Button size={"icon"} variant={"outline"} onClick={() => removeList1(index)}>
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-muted">
                                        <TableCell className="py-2"><Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                appendList1({ value: "", id: "" })
                                            }}>
                                            Add Earnings
                                        </Button></TableCell>
                                        <TableCell className="p-1"> </TableCell>
                                        <TableCell className="p-1"> </TableCell>
                                        <TableCell className="p-1">

                                        </TableCell>
                                        <TableCell> </TableCell>
                                    </TableRow>

                                    {fieldsList2.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`deduction.${index}.id`}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select earnings" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="m@example.com">m@example.com</SelectItem>
                                                                <SelectItem value="m@google.com">m@google.com</SelectItem>
                                                                <SelectItem value="m@support.com">m@support.com</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`deduction.${index}.value`}
                                                    render={({ field }) => (
                                                        <FormItem>

                                                            <FormControl>
                                                                <Input placeholder="Employee Office Email" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Label>
                                                    Monthly Amount
                                                </Label>
                                            </TableCell>
                                            <TableCell>
                                                <Label>
                                                    Yearly Amount
                                                </Label>
                                            </TableCell>
                                            <TableCell>
                                                <Button size={"icon"} variant={"outline"} onClick={() => removeList2(index)}>
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-muted p-0">
                                        <TableCell className="py-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    appendList2({ value: "", id: "" })
                                                }}>
                                                Add Deductions
                                            </Button>
                                        </TableCell>
                                        <TableCell className="p-1"> </TableCell>
                                        <TableCell className="p-1"> </TableCell>
                                        <TableCell className="p-1">

                                        </TableCell>
                                        <TableCell> </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex flex-row gap-1">
                                                        <Label>Fixed Allowance</Label>
                                                        <Info className="h-4 w-4" />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="w-40">Fixed allowance is a residual component of salary that is left after allocations are made for all other components.</p>
                                                </TooltipContent>
                                            </Tooltip>

                                        </TableCell>
                                        <TableCell>Fixed amount</TableCell>
                                        <TableCell>₹7083</TableCell>
                                        <TableCell>₹85000</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableBody>
                                <TableFooter>
                                    <TableCell>Cost to Company</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>₹7083</TableCell>
                                    <TableCell>₹85000</TableCell>
                                    <TableCell></TableCell>
                                </TableFooter>
                            </Table>
                        </div>
                    </div>
                    <Button type="submit">Update profile</Button>
                </form>
            </Form>
        </TooltipProvider>

    )
}