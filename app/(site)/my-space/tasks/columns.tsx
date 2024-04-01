// "use client"

// import { ColumnDef } from "@tanstack/react-table"

// import DateTimeCell from "@/components/common/date-time-cell";
// import { LeaveRequest } from "@/types/leave";
// import StatusCell from "@/components/common/status-cell";
// import ShiftCell from "@/components/common/shift-cell";
// import { Task } from "@/types/task";
// import AvatarCell from "@/components/common/avatar-cell";
// import { CellAction } from "./cell-action";


// export const columns: ColumnDef<Task>[] = [
//     {
//         header: "Assigned By",
//         accessorKey: "profile",
//         cell: ({ row }) => {
//             // Access nested data directly from the row's original data
//             const profile = row.original.initiator;
//             return <AvatarCell
//                 avatarUrl={""}
//                 employeeName={profile.name}
//                 employeeId={profile.employeeId} // Assuming you have a strategy for the ID
//             />
//         }
//     },
//     {
//         header: "Name",
//         accessorKey: "name",
//     }, 
//     {
//         header: "Duration",
//         accessorKey: "taskDuration",
//     },
//     {
//         header: "Status",
//         accessorKey: "status",
//     },
//     {
//         header: "Priority",
//         accessorKey: "priority",
//     }, 
//     {
//         accessorKey: "createdAt",
//         header: "Created At",
//         cell: ({ row }) => <DateTimeCell dateStr={row.getValue("createdAt")} isTime={2} />
//     },
//     {
//         id: "actions",
//         cell: ({ row }) => <CellAction data={row.original} />
//     },

// ];
