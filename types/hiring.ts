import { Department, Organisation, Profile } from "./profile"

export interface Candidate {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  active: boolean
  organisation: Organisation
  name: string
  email: string
  phone: string
  canRelocate: boolean
  latestTransition: WorkflowLine
  source: string
  screeningRating: number
  interviewRating: number
  managerRating: number
  refer: string
  position: Position
}

export interface Workflow {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  active: boolean
  organisation: Organisation
  name: string
}

export interface WorkflowLine {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  active: boolean
  workflow: Workflow
  transitionName: string
  transitionLevel: number
  sendEmail: boolean
  approver: Profile
}

export interface Position {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  active: boolean
  organisation: Organisation
  title: string
  location: Location
  hiringLead: Profile
  department: Department
  employmentType: string
  minExperience: number
  ctc: number
  description: string
  code: string
  status: string
}