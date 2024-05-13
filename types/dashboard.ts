import { Daylog } from "./attendance"

export interface DashboardData {
    leaveRequestCount: number
    totalHeadCount: number
    inBreakCount: Daylog[]
    activeCount: Daylog[]
    monthwiseHeadCount: MonthwiseHeadCount[]
}

export interface MonthwiseHeadCount {
    name: string
    total: number
}
