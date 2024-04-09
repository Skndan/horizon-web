import { Organisation } from "./profile"

export interface SalaryTemplateItem {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  active: boolean
  componentName: string
  componentInPayslip: string
  componentType: ComponentType
  value: number
  calculationType: string
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

export interface SalaryComponentItem {
  id: string 
  componentName: string 
  value: number
  componentType: ComponentType
  calculationType: string
  monthly: number
  yearly: number
}

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
  ctc: number
  fixed: number
  earnings: SalaryTemplateItem[] 
}