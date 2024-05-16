import { Profile } from "./profile"

export interface Shift {
    id: string
    name: string
    startTime: string
    endTime: string
    isDynamic: boolean
    schedules: ShiftSchedule[]
    workDays: string[]
}

export interface ShiftSchedule {
    id: string
    shift: Shift
    weekNumber: number
    workDays: string[]
}

export interface Daylog {
    id: string
    createdAt: string
    updatedAt: string
    createdBy: any
    updatedBy: any
    active: boolean
    totalWork: number
    totalBreak: number
    profile: Profile
    status: string
    endTime: any
    timeSheetPrepared: boolean
}


export interface MonthlyDaylog {
    log: string[]
    profile: Profile
}

export interface Timesheet {
    id: string
    createdAt: string
    updatedAt: string
    createdBy: any
    updatedBy: any
    active: boolean
    dayLogs: Daylog[]
    profile: Profile
    remarks: string,
    status: string,
    fromDate: string,
    toDate: string,
    totalDays: number,
    loggedDays: number,
    holidays: number,
    approvedLeave: number,
    lop: number,
    workHours: number,
    otHours: number,
    totalWork: number,
    totalBreak: number
}

export interface Attendance {
    id: string
    createdAt: string
    updatedAt: string
    createdBy: string
    updatedBy: string
    active: boolean
    profile: Profile
    setDate: string
    setTime: string
    reason: string
    remarks: string
    status: string
  }