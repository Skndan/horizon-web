export interface DashboardData {
    leaveRequestCount: number
    totalHeadCount: number
    inBreakCount: number
    activeCount: number
    monthwiseHeadCount: MonthwiseHeadCount[]
}

export interface MonthwiseHeadCount {
    name: string
    total: number
}
