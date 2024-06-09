import { Daylog } from "./attendance"

export interface DashboardData {
    leaveRequestCount: number
    totalHeadCount: number
    inBreakCount: Daylog[]
    activeCount: Daylog[]
    monthwiseHeadCount: MonthwiseHeadCount[]
    departmentCount: number; 
    shiftCount: number; 
    officeCount: number; 
    leaveTypeCount: number;
}

export interface MonthwiseHeadCount {
    name: string
    total: number
}
