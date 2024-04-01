import { Profile } from "./profile"

export interface Task {
    id: string
    createdAt: string
    updatedAt: string
    createdBy: string
    updatedBy: string
    active: boolean
    title: string
    description: string
    notes: string
    assignee: Profile
    initiator: Profile
    taskDate: string
    taskDuration: string
    status: string
}

export interface OrganisationTask {
    profileId: string
    profileName: string
    profileCode: string
    tasks: Task[]
}
