import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  notes: z.any(),
  assignee: z.any(),
  initiator: z.any(),
  taskDate: z.any(),
  taskDuration: z.any(),
  status: z.string(),
})

export type Task = z.infer<typeof taskSchema>
