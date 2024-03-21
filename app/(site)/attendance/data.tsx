export const attendance = [
    {
        avatar: "https://i.pravatar.cc/300?img=1",
        name: "Emma Johnson",
        firstIn: "08:00",
        lastOut: "17:00",
        total: "9.00",
        shift: "Shift-1",
    },
    {
        avatar: "https://i.pravatar.cc/300?img=2",
        name: "Michael Brown",
        firstIn: "09:00",
        lastOut: "18:00",
        total: "9.00",
        shift: "Shift-1",
    },
    {
        avatar: "https://i.pravatar.cc/300?img=3",
        name: "Olivia Lee",
        firstIn: "10:00",
        lastOut: "19:00",
        total: "9.00",
        shift: "Shift-2",
    },
    {
        avatar: "https://i.pravatar.cc/300?img=4",
        name: "James Smith",
        firstIn: "11:00",
        lastOut: "20:00",
        total: "9.00",
        shift: "Shift-2",
    },
    {
        avatar: "https://i.pravatar.cc/300?img=5",
        name: "Isabella Taylor",
        firstIn: "08:30",
        lastOut: "17:30",
        total: "9.00",
        shift: "Shift-1",
    }
]

export type Attendance = (typeof attendance)[number]


export const monthlyAttendance = [
    { name: 'John Doe', attendance: { '2024-03-01': true, '2024-03-02': false, '2024-03-03': true } }
]

export type MonthlyAttendance = (typeof monthlyAttendance)[number]