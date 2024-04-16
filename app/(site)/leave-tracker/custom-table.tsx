import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface TimesheetPageProps {
    data: any;
};

export const CustomTable: React.FC<TimesheetPageProps> = ({
    data
}) => {
    // Extracting unique column headers dynamically
    const headers = Array.from(
        new Set(
            Object.values(data).flatMap((item: any) => Object.keys(item))
        )
    );

    // Extracting names from the keys of the raw JSON data
    const names = Object.keys(data);
 
    return (
        <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead> {/* First column for names */}
                    {/* Rendering table headers */}
                    {headers.map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {/* Rendering table rows */}
                {names.map((name, rowIndex) => (
                    <TableRow key={rowIndex}>
                        <TableCell>{name}</TableCell> {/* First column for names */}
                        {headers.map((header, colIndex) => (
                            <TableCell key={colIndex}>{data[name][header] || '-'}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    );
};

export default CustomTable;