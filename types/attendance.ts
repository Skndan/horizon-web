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


// {
//     "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     "createdAt": "2022-03-10",
//     "updatedAt": "2022-03-10",
//     "createdBy": "string",
//     "updatedBy": "string",
//     "active": true,
//     "shift": {
//       "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//       "createdAt": "2022-03-10",
//       "updatedAt": "2022-03-10",
//       "createdBy": "string",
//       "updatedBy": "string",
//       "active": true,
//       "name": "string",
//       "startTime": "13:45:30.123456789",
//       "endTime": "13:45:30.123456789",
//       "isDynamic": true,
//       "workDays": [
//         "MON"
//       ]
//     },
//     "workDays": [
//       "MON"
//     ],
//     "weekNumber": 0
//   }