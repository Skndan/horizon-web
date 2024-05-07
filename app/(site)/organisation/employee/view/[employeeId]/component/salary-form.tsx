"use client"

import { Profile } from "@/types/profile"
import { Info, Loader, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useUpdateStore } from "@/store/use-update-store";
import apiClient from "@/lib/api/api-client";
import { useAuth } from "@/context/auth-provider";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" 

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import toast from "react-hot-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area"
import { calculationType, inWords } from "@/lib/utils/string-utils"
import { Label } from "@/components/ui/label";
import { SalaryTemplate, SalaryTemplateItem } from "@/types/payroll";
import { Input } from "@/components/ui/input";

interface SalaryCardProps {
    profile: Profile | null;
    earningType: SalaryTemplateItem[],
    deductionType: SalaryTemplateItem[],
};

const formSchema = z.object({
    ctc: z.any(),
    fixed: z.any(),
    earnings: z.any()
})

type EmployeeFormValues = z.infer<typeof formSchema>

export const SalaryFormCard: React.FC<SalaryCardProps> = ({
    profile,
    earningType,
    deductionType
}) => {

    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
        mode: "onChange"
    });

    const [loading, setLoading] = useState(true)
    const { user } = useAuth();
    const [template, setTemplate] = useState<SalaryTemplate | null>(null);
    const [earnings, setEarnings] = useState<SalaryTemplateItem[]>([]);

    const [ctc, setCtc] = useState({ monthly: 0, yearly: 0 });

    // Function to be triggered whenever there's a change in the form fields
    const handleFieldChange = async (fieldName: string, value: any, index: number) => {
        // Perform your desired actions here, such as sending data to an API or updating state  
        var obj = {
            [fieldName]: value,
            earnings: earnings
        }

        if (fieldName === "ctc") {
            await apiClient
                .put(`/profile-salary-template/${template?.id}`, obj)
                .then((res) => res.data)
                .then((data) => {
                    setTemplate(data);
                    setEarnings(convertStringDatesToDateObjects(data.earnings).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()));
                    setCtc(data?.ctc ? { monthly: data.ctc / 12, yearly: data.ctc } : { monthly: 0, yearly: 0 });
                });
        } else {


            let item = earnings[index];
            item.value = value;

;

            await apiClient
                .put(`/profile-salary-template/line/${template?.id}`, item)
                .then((res) => res.data)
                .then((data) => {
                    setTemplate(data);
                    setEarnings(convertStringDatesToDateObjects(data.earnings).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()));
                });
        }
    };

    const convertStringDatesToDateObjects = (items: SalaryTemplateItem[]) => {
        return items.map(item => {
            return {
                ...item,
                createdAt: typeof item.createdAt === 'string' ? new Date(item.createdAt) : item.createdAt,
                updatedAt: typeof item.updatedAt === 'string' ? new Date(item.updatedAt) : item.updatedAt,
            };
        });
    };


    const addEarning = async (value: SalaryTemplateItem) => {
        // const earnings = getValues('earnings');

;

        if ((earnings.find(x => x.componentName === "Basic") === undefined) && (value.componentName !== "Basic")) {
            toast.error("Please add Basic first")
            return;
        } 
        
        await apiClient
            .put(`/profile-salary-template/line/${template?.id}`, value)
            .then((res) => res.data)
            .then((data) => {
                setTemplate(data);
                setEarnings(convertStringDatesToDateObjects(data.earnings).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()));
            });
    };

    const removeEarning = async (index: number) => {
        await apiClient
            .delete(`/profile-salary-template/line/${earnings[index].id}/${template?.id}`)
            .then((res) => res.data)
            .then((data) => {
                setTemplate(data);
                setEarnings([...earnings.slice(0, index), ...earnings.slice(index + 1)]);
            });
    };

    async function fetchData() {

        //get if the salary template is associated 
        await apiClient.get(`/profile-salary-template/get-by-profile/${profile?.id}`).then((res) => res.data)
            .then((data) => {
                setTemplate(data)
                form.setValue("ctc", data.ctc);
                setEarnings(data.earnings)
                setLoading(false)
            }).catch(async (error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    if (error.response.status === 400) {
                        toast.error("Profile salary is not found");

                        await apiClient.get(`/profile-salary-template/get-by-profile/${profile?.id}`).then((res) => res.data)
                            .then((data) => {
                                setTemplate(data)
                                form.setValue("ctc", data.ctc);
                                setEarnings(data.earnings)
                                setLoading(false)
                            });
                        // Inform the user about the bad request
                        // alert('Bad request. Please check your input.');
                    } else {
                        // For other errors, log the error message
;
                    }
                } else {
                    // The request was made but no response was received
;
                }
            });
    }

    const { flag, set } = useUpdateStore();

    useEffect(() => {
        fetchData();
    }, [flag])

    const onSubmit = async (data: EmployeeFormValues) => {

    };


    return (
        <>
            <TooltipProvider>
                <div className="flex-col">
                    <div className="flex-1">
                        {loading ?
                            (
                                <div className="grid h-screen place-items-center">
                                    <Loader className="animate-spin h-5 w-5 mr-3" />
                                </div>
                            )
                            : (
                                <>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                            <div>
                                                <div className="flex flex-row  rounded-t-lg border-t border-l border-r items-center justify-between p-4">
                                                    <div className="first:flex  md:flex-row gap-4 items-center">
                                                        <Label>Annual CTC</Label>
                                                        <FormField
                                                            control={form.control}
                                                            name="ctc"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <div className="relative">
                                                                            <div className='absolute right-0 h-10 flex justify-center items-center rounded-r-lg border'>
                                                                                <Label className="text-foreground px-4 text-sm">per year</Label>
                                                                            </div>
                                                                            <Input
                                                                                type={'number'}
                                                                                placeholder="CTC"
                                                                                className="pr-20"
                                                                                {...field}
                                                                                onChange={(e) => {
                                                                                    handleFieldChange('ctc', e.target.value, -1);
                                                                                    field.onChange(e);
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <Label className="text-muted-foreground">{inWords(ctc.yearly.toString())}</Label>
                                                    </div> 
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            {/* disabled={watchCtc === "" || watchCtc === "0"} */}
                                                            <Button size="sm" >
                                                                Add Components
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <ScrollArea className="h-[250px] w-[200px]">
                                                                <DropdownMenuLabel className="text-green-500">Earnings</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                {earningType.map((earning) => (
                                                                    <>
                                                                        <DropdownMenuItem disabled={earnings.find(x => x.componentName === earning.componentName) !== undefined} key={earning.id} onClick={(e) => {
                                                                            addEarning(earning);
                                                                        }}>
                                                                            {earning.componentName}
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                    </>
                                                                ))}
                                                                <DropdownMenuLabel className="text-red-500">Deductions</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                {deductionType.map((deduction) => (
                                                                    <>
                                                                        <DropdownMenuItem disabled={earnings.find(x => x.componentName === deduction.componentName) !== undefined} key={deduction.id} onClick={(e) => {
                                                                            addEarning(deduction);
                                                                        }}>
                                                                            {deduction.componentName}
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                    </>
                                                                ))}
                                                            </ScrollArea>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>

                                                </div>
                                                <div className="rounded-b-lg border">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Salary Components</TableHead>
                                                                <TableHead className="w-[300px]">Calculation type</TableHead>
                                                                <TableHead>Monthly Amount</TableHead>
                                                                <TableHead>Annual Amount</TableHead>
                                                                <TableHead></TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {earnings.map((item: any, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>
                                                                        <>
                                                                            <FormField
                                                                                control={form.control}
                                                                                name={`earnings.${index}.id`}
                                                                                render={({ field }) => (
                                                                                    <FormItem>
                                                                                        <FormControl>
                                                                                            <Input key={`${item.id}-id`} type="hidden"  {...field} value={item.id} />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                            <Label>{item.componentName}</Label>
                                                                        </>
                                                                    </TableCell>
                                                                    <TableCell key={`${item.id}-table-cell`}>
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`earnings.${index}.value`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <div className="relative">
                                                                                            <div className='absolute right-0 h-10 flex justify-center items-center rounded-r-lg border'>
                                                                                                <Label className="text-foreground px-4 text-sm">{calculationType(item.calculationType)}</Label>
                                                                                            </div>
                                                                                            <Input
                                                                                                key={`${item.id}-input`}
                                                                                                type={'text'}
                                                                                                placeholder="Amount"
                                                                                                className="pr-20"
                                                                                                max={100}
                                                                                                defaultValue={item.value}
                                                                                                {...field}
                                                                                                onBlur={(e) => {
                                                                                                    e.preventDefault();
                                                                                                    handleFieldChange(`${item.componentName}`, e.target.value, index);
                                                                                                    field.onChange(e);
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            <Label className={item.componentType.type === "EARNING" ? "text-green-600" : "text-red-600"}>
                                                                                +₹{item.monthly?.toFixed()}
                                                                            </Label>
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            <Label className={item.componentType.type === "EARNING" ? "text-green-600" : "text-red-600"}>
                                                                                +₹{item.yearly?.toFixed()}
                                                                            </Label>
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button size={"icon"} variant={"outline"} className="text-red-500" onClick={(e) => {
                                                                            e.preventDefault();
                                                                            removeEarning(index);
                                                                        }}>
                                                                            <Trash className="h-4 w-4" />
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}

                                                            <TableRow>
                                                                <TableCell>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <div className="flex flex-row gap-1">
                                                                                <Label>Special Allowance</Label>
                                                                                <Info className="h-4 w-4" />
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p className="w-40">Special allowance is a residual component of salary that is left after allocations are made for all other components.</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>

                                                                </TableCell>
                                                                <TableCell>Fixed amount</TableCell>
                                                                <TableCell>₹{(template!.fixed / 12).toFixed()}</TableCell>
                                                                <TableCell>₹{template!.fixed.toFixed()}</TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                            <TableRow className={"bg-muted"}>
                                                                <TableCell>Cost to Company</TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell>₹{(template!.ctc / 12).toFixed()}</TableCell>
                                                                <TableCell>₹{template!.ctc.toFixed()}</TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                        </TableBody>

                                                    </Table>
                                                </div>
                                            </div>
                                        </form>
                                    </Form>
                                </>
                            )}
                    </div>
                </div>
            </TooltipProvider>
        </>
    )
}