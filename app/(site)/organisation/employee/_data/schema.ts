import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1),
  mobile: z.string().min(1),
  employeeId: z.string().min(1),
  dateOfJoining: z.any().optional(),
  gender: z.string().min(1).optional(),
  dateOfBirth: z.any().optional(),
  organisation: z.any().optional(),
  employeeStatus: z.any().optional(),
  department: z.any().optional(),
  address: z.any().optional(),
  shift: z.any().optional(),
  designation: z.any().optional(),
  reportingManager: z.any().optional(),
  user: z.any()
})


// const formSchema = z.object({
//   name: z.string().min(1),
//   email: z.string().min(1),
//   mobile: z.string().min(1),
//   employeeId: z.string().min(1),
//   dateOfJoining: z.any().optional(),
//   gender: z.string().min(1).optional(),
//   dateOfBirth: z.any().optional(),
//   organisation: z.any().optional(),
//   employeeStatus: z.any().optional(),
//   department: z.any().optional(),
//   address: z.any().optional(),
//   shift: z.any().optional(),
//   designation: z.any().optional(),
//   reportingManager: z.any().optional(),
//   user: z.any()
// });


// const accountSchema = z.object({
//   accountHolderName: z.string().min(1),
//   bankName: z.string().min(1),
//   accountNumber: z.string().min(1),
//   ifscCode: z.string().min(1),
//   panNumber: z.any().optional(),
//   uanNumber: z.string().min(1).optional(),
//   profile: z.any()
// });

 
export type Task = z.infer<typeof taskSchema>
