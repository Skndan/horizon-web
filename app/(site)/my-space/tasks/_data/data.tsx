import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"
 

// TODO, INPROGRESS, REVIEW, DONE, CANCELLED, REOPENED, ARCHIVED
export const statuses = [ 
  {
    value: "TODO",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "INPROGRESS",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "REVIEW",
    label: "Review",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "DONE",
    label: "Done",
    icon: CheckCircledIcon,
  },

  {
    value: "CANCELLED",
    label: "Cancelled",
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
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "HIGH",
    icon: ArrowUpIcon,
  },
]
