import { z } from "zod"

// Define the schema for the PayrollRun object
const ProfileSchema = z.object({
  id: z.any(),
  name: z.string(),
  email: z.string(),
  mobile: z.string(),
  employeeId: z.string(),
});


// Define the schema for EmployeePayrollRun
export const EmployeePayrollRunSchema = z.object({
  id: z.any(),
  createdAt: z.any(),
  updatedAt: z.any(),
  createdBy: z.any(),
  updatedBy: z.any(),
  active: z.boolean(),
  profile: ProfileSchema,
  // payrollRun: PayrollRunSchema,
  totalDays: z.number(),
  loggedDays: z.number(),
  totalEarnings: z.number(),
  totalDeductions: z.number(),
  lossOfPay: z.number(),
  grossPay: z.number(),
  netPay: z.number(),
});


export type EmployeePayrollRun = z.infer<typeof EmployeePayrollRunSchema>
