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
    organisation: Organisation
    department: Department
    location: any
    designation: any
    dateOfJoining: any
    reportingManager: any
    gender: any
    dateOfBirth: any
    user: User
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
    id?: string
    createdAt?: string
    updatedAt?: string
    createdBy?: string
    updatedBy?: string
    active?: boolean
    name?: string
    code?: string
  }
  
  export interface Location {
    id?: string
    createdAt?: string
    updatedAt?: string
    createdBy?: string
    updatedBy?: string
    active?: boolean
    name?: string
    address?: string
    country?: string
    state?: string
    pincode?: string
  }
  