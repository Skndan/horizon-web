import { Organisation, Profile } from "./profile"

export interface LeaveType {
    id: string
    createdAt: string
    updatedAt: string
    createdBy: any
    updatedBy: any
    active: boolean
    organisation: Organisation
    name: string
    count: number
}

export interface LeaveRequest {
    id: string
    createdAt: string
    updatedAt: string
    createdBy: any
    updatedBy: any
    active: boolean
    profile: Profile
    leaveType: LeaveType
    status: string
    reason: string
    startDate: string
    endDate: string
}


export interface LeaveBalance {
    id: string
    createdAt: string
    updatedAt: string
    createdBy: any
    updatedBy: any
    active: boolean
    profile: Profile
    leaveType: LeaveType
    balance: number
  }