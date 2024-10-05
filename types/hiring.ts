import { Department, FileInfo, Organisation, Profile } from "./profile"

export interface Candidate {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  active: boolean
  organisation: Organisation
  applicationNumber: number
  name: string
  email: string
  mobile: string
  canRelocate: boolean
  interview: string
  source: string
  refer: string
  position: Position
  fileInfo: FileInfo
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
  workflowLines: WorkflowLine[]
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
  stage: string
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

export interface Interview {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  active: boolean
  candidate: Candidate
  workflow: Workflow
  latestTransition: WorkflowLine
  interviewDate: string
  startTime: string
  endTime: string
  disQualified: boolean
  score: number
}

export interface InterviewLine {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  active: boolean
  interview: Interview
  workflowLine: WorkflowLine
  score: number
  remarks: string
  disQualified: boolean
}