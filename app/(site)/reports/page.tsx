"use client";
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
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import apiClient from "@/lib/api/api-client";
import { Reports } from "@/types/reports";
import { CellAction } from "./components/cell-action";
import toast from "react-hot-toast";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";
import { CircleAlert } from "lucide-react";
import { useState } from "react";
import { dateObjectToString, timeObjectToString } from "@/lib/utils/time-utils";
import { addMonths } from "date-fns";

const ReportPage = () => {

    const { user } = useAuth();

    const [date, setDate] = useState<DateRange>({
        from: new Date(),
        to: addMonths(new Date(), 1),
    })

    const download = async (data: Reports) => {
        try {
            // Make the API call to download the employee list
            var startTime = dateObjectToString(date.from!);
            var endTime = dateObjectToString(date.to!);

            await apiClient.get(`${data.url}/${data.isOrg ? user?.orgId : user?.profileId}/${startTime}/${endTime}`, {
                responseType: 'blob' // important to handle the file as a blob
            }).then(response => {
                
                // if(response.data.status === 400){
                //    // Inform the user about the bad request
                //    toast.error('Oops...Report is not available'); 
                //    return;
                // }

                // Create a URL for the blob and link to it for downloading
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', data.fileName); // Specify the filename
                document.body.appendChild(link);
                link.click();

                // Cleanup the link after download
                document.body.removeChild(link);
            }).catch(error => {
                // Handle errors
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    if (error.response.status === 400) {

                        // Inform the user about the bad request
                        toast.error('Oops...Report is not available');
                        return;
                    } else {
                        // For other errors, log the error message

                    }
                } else {
                    // The request was made but no response was received

                }
            });
        } catch (error) {
            console.error('Error downloading the employee list', error);
        }
    };

    // Function to be passed to the child component
    const handleAction = (report: Reports) => {
        if (report.url === "") {
            toast.error("This report is not available at the moment");
            return;
        }
        download(report);
    };

    const data: Reports[] = [
        {
            name: "Employees",
            url: "/report/employees",
            description: "Get all employee's by date of joining",
            fileName: "employee-report.xlsx",
            isOrg: true
        },
        {
            name: "Attendance Logs",
            url: "/report/attendance",
            description: "Get all attendance logs of the employee's in the date range",
            fileName: "attendance-report.xlsx",
            isOrg: true
        },
        {
            name: "Timesheets",
            url: "",
            description: "",
            fileName: "",
            isOrg: true
        },
        {
            name: "Leave Report",
            url: "",
            description: "",
            fileName: "",
            isOrg: true
        },
        {
            name: "Account Details",
            url: "",
            description: "",
            fileName: "",
            isOrg: true
        }
    ];

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <Heading title={`📊 Reports`} description="Manage your reports" />
                        <div className="flex flex-col items-end space-x-2 gap-2">
                            <CalendarDateRangePicker onChanged={(value: DateRange | undefined) => {
                                if (value?.to) {
                                    setDate(value);
                                }
                            }} className={''} />
                            <div className="flex flex-row items-center gap-2">
                                <CircleAlert className="text-muted-foreground h-4 w-4" />
                                <Label className="text-muted-foreground">Reports will generate based on the date range</Label>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((invoice) => (
                                    <TableRow key={invoice.name}>
                                        <TableCell>
                                            <div className="flex flex-col gap-2">
                                                <Label>{invoice.name}</Label>
                                                <Label className="text-muted-foreground">{invoice.description}</Label>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right"><CellAction data={invoice} onAction={handleAction} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center">*This is a Beta feature</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>



                </div>
            </div>
        </>)
}

export default ReportPage;