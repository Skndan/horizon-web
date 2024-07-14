import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  organisation: z.any(),
  name: z.any(),
  email: z.any(),
  mobile: z.any(),
  canRelocate: z.any(),
  source: z.any(),
  refer: z.any(),
  position: z.any(),
})
 
export type Task = z.infer<typeof taskSchema>
