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
import { columns } from "./components/columns";
import { Reports } from "@/types/reports";
import { CellAction } from "./components/cell-action";
import toast from "react-hot-toast";

const ReportPage = () => {

    const { user } = useAuth();

    const download = async (data: Reports) => {
        try {
            // Make the API call to download the employee list
            const response = await apiClient.get(`${data.url}/${data.isOrg ? user?.orgId : user?.profileId}`, {
                responseType: 'blob' // Important to handle the file as a blob
            });

            // Create a URL for the blob and link to it for downloading
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'employee_report.xlsx'); // Specify the filename
            document.body.appendChild(link);
            link.click();

            // Cleanup the link after download
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading the employee list', error);
        }
    };

    // Function to be passed to the child component
    const handleAction = (report: Reports) => {
        if(report.url === ""){
            toast.error("This report is not available at the moment");
        }
        console.log('Action on report:', report);
        download(report);
    };

    const data: Reports[] = [
        {
            name: "Employees",
            url: "/report/employees",
            isOrg: true
        },
        {
            name: "Attendance Logs",
            url: "",
            isOrg: true
        },
        {
            name: "Timesheets",
            url: "",
            isOrg: true
        },
        {
            name: "Leave Report",
            url: "",
            isOrg: true
        },
        {
            name: "Account Details",
            url: "",
            isOrg: true
        }
    ];

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between">
                        <Heading title={`Reports`} description="Manage your reports" />
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
                                        <TableCell>{invoice.name}</TableCell>
                                        <TableCell className="text-right"><CellAction data={invoice} onAction={handleAction} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center">This is experimental</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>



                </div>
            </div>
        </>)
}

export default ReportPage;