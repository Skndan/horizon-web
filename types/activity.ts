import { Profile } from "./profile"

export interface Activity {
    id: string
    createdAt: string
    updatedAt: string
    createdBy: any
    updatedBy: any
    active: boolean
    name: string
    description: string
    notes: string
    startDate: string
    dueDate: string
    startTime: string
    dueTime: string
    attendies: Profile[]
    status: string
    visibility: string
    location: string
    type: string
    initiator: Profile
    outcome: string
}