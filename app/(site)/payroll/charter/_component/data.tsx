import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"
import { Equal } from "lucide-react"
 

// TODO, INPROGRESS, REVIEW, DONE, CANCELLED, REOPENED, ARCHIVED
export const statuses = [ 
  {
    value: "TODO",
    label: "Todo",
    color: "text-grey-500",
    icon: CircleIcon,
  },
  {
    value: "INPROGRESS",
    label: "In Progress",
    color: "text-blue-500",
    icon: StopwatchIcon,
  },
  {
    value: "REVIEW",
    label: "Review",
    color: "text-amber-500",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "DONE",
    label: "Done",
    color: "text-green-500",
    icon: CheckCircledIcon,
  },

  {
    value: "CANCELLED",
    label: "Cancelled",
    color: "text-red-500",
    icon: CrossCircledIcon,
  }
]

export const priorities = [
  {
    label: "Low",
    value: "LOW",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "MEDIUM",
    icon: Equal,
  },
  {
    label: "High",
    value: "HIGH",
    icon: ArrowUpIcon,
  },
]
