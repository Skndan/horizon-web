import { Shift } from "./attendance"

export interface Profile {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: any
  updatedBy: any
  active: boolean
  name: string
  email: string
  mobile: string
  employeeId: any
  employeeStatus: string,
  organisation: Organisation
  department: Department
  address: Address
  designation: any
  dateOfJoining: any
  reportingManager: any
  gender: any
  shift: Shift
  dateOfBirth: any
  user: User
}

export interface Designation {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  active: boolean
  name: string
  code: string
  level: string
}

export interface Organisation {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: any
  updatedBy: any
  active: boolean
  name: string
  type: Type
  email: string
  mobile: any
  state: any
  pincode: any
}

export interface Type {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: any
  updatedBy: any
  active: boolean
  name: string
}

export interface User {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: any
  updatedBy: any
  active: boolean
  userName: string
  password: string
  roles: Role[]
}

export interface Role {
  id: string
  createdAt: any
  updatedAt: any
  createdBy: any
  updatedBy: any
  active: boolean
  roleName: string
  roleType: string
}

export interface Department {
  id: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  active?: boolean
  name: string
  code: string
  organisation?: Organisation
}

export interface Address {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  active: boolean
  isPrimary: boolean
  label: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  pincode: string
  organisation: Organisation
}

export interface Account {
  id: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  active?: boolean
  profile?: Profile
  accountHolderName?: string
  bankName?: string
  accountNumber?: string
  ifscCode?: string
  panNumber?: string
  uanNumber?: string
}


export interface FileInfo {
  id: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  active?: boolean
  fileName?: string
  hash?: string
  fileUrl?: string
}

export interface Designation {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  active: boolean
  name: string
  code: string
  level: string
}
