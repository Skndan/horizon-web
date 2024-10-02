import { ComponentProps } from "react"
import formatDistanceToNow from "date-fns/formatDistanceToNow"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator" 
import { useMail } from "@/store/use-mail-store"
import { Mail } from "./data"
import { Interview } from "@/types/hiring"
import { CandidateInfo } from "./_card/candidate-info"

interface MailListProps {
  interview: Interview | null
}

export function MailList({ interview }: MailListProps) {
  
  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
      <CandidateInfo interview={interview} />
      </div>
    </ScrollArea>
  )
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default"
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline"
  }

  return "secondary"
}