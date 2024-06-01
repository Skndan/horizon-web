import { Organisation, Profile } from "./profile"

export interface SalaryTemplateItem {
  id: string
  createdAt: Date | string
  updatedAt: Date | string
  createdBy: string
  updatedBy: string
  active: boolean
  componentName: string
  componentInPayslip: string
  componentType: ComponentType
  value: number
  calculationType: string
  salaryComponent: SalaryTemplateItem
}

export interface SalaryComponent {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: any
  updatedBy: any
  active: boolean
  componentName: string
  componentInPayslip: string
  componentType: ComponentType
  value: number
  calculationType: string
}

// export interface SalaryComponentItem {
//   id: string 
//   componentName: string 
//   value: number
//   componentType: ComponentType
//   calculationType: string
//   monthly: number
//   yearly: number
// }

export interface ComponentType {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  active: boolean
  name: string
  description: string
  type: string
  fixed: boolean
}

export interface PaySchedule {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  active: boolean
  organisation: Organisation
  payDay: string
  payDayValue: number
  payCheck: string
  payCheckValue: number
}

export interface SalaryTemplate {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  active: boolean
  name: string
  description: string
  profile: Profile
  ctc: number
  fixed: number
  status: string
  earnings: SalaryTemplateItem[]
}

export interface PayrollCharter {
  payrollRun: PayrollRun
  employeePayrollRuns: EmployeePayrollRun[]
  salaryLessProfile: Profile[]
  missedTimesheets: MissedTimesheet[]
}

export interface PayrollRun {
  id: any
  createdAt: any
  updatedAt: any
  createdBy: any
  updatedBy: any
  active: boolean
  organisation: Organisation
  payPeriodStartDate: string
  payPeriodEndDate: string
  payDate: any
  totalEarnings: number
  totalDeductions: number
  grossPay: number
  netPay: number
  headCount: number
  status: string
}

export interface EmployeePayrollRun {
  id: any
  createdAt: any
  updatedAt: any
  createdBy: any
  updatedBy: any
  active: boolean
  profile: Profile
  payrollRun: PayrollRun
  totalDays: number
  workingDays: number
  loggedDays: number
  totalEarnings: number
  totalDeductions: number
  lossOfPay: number
  grossPay: number
  netPay: number
}

export interface MissedTimesheet {
  profile: Profile
  unclaimedDays: number
  unclaimedDates: string[]
}