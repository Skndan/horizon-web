import addDays from "date-fns/addDays"
import addHours from "date-fns/addHours"
import format from "date-fns/format"
import nextSaturday from "date-fns/nextSaturday"
import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
} from "lucide-react"

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
// import { Switch } from "@/components/ui/switch"
// import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Activity } from "@/types/activity"
import { formatDate } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { toTitleCase } from "@/lib/utils/string-utils"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface MailDisplayProps {
  mail: Activity | null
}

export function MailDisplay({ mail }: MailDisplayProps) {
  const today = new Date()

  return (
    <div className="flex-1 h-full flex-col">
      <div className="flex items-center p-2">
        <div className="ml-auto flex items-center gap-2">

        </div>
        {/* <Separator orientation="vertical" className="mx-2 h-6" /> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!mail}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={mail.initiator.name} />
                <AvatarFallback>
                  {mail.initiator.name
                    .split(" ")
                    .map((chunk: any) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{mail.initiator.name}</div>
                <div className="line-clamp-1 text-xs">{mail.name}</div>
              </div>
            </div>
            {mail.updatedAt && (
              <div className="ml-auto items-end flex flex-col space-y-1">
                <div className="text-xs text-muted-foreground">
                  {formatDate(new Date(mail.updatedAt), "PPpp")}
                </div>
                <Badge className={`${mail.type == "ACTIVITY" ? "bg-green-400" : "bg-amber-400"}`}>
                  {toTitleCase(mail.type)}
                </Badge>
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm"> 
            <p dangerouslySetInnerHTML={{ __html: mail.description }}></p>
          </div>
          <Separator className="mt-auto" />


          <div className="grid">
            <div className="flex flex-col p-4 hover:bg-muted">
              <Label className="text-muted-foreground">Location</Label>
              <Label className="text-md pt-1">{mail.location}</Label>
            </div>
            <div className="grid grid-cols-4">
              <div className="flex flex-col p-4 hover:bg-muted">
                <Label className="text-muted-foreground">Start Date</Label>
                <Label className="text-md pt-1">{formatDate(mail.startDate, "dd MMM yyyy")}</Label>
              </div>
              <div className="flex flex-col p-4 hover:bg-muted">
                <Label className="text-muted-foreground">Due Date</Label>
                <Label className="text-md pt-1">{formatDate(mail.dueDate, "dd MMM yyyy")}</Label>
              </div>
              {/* <div className="flex flex-col p-4 hover:bg-muted">
                <Label className="text-muted-foreground">Employee</Label>
                <Label className="text-md pt-1">employeeId</Label>
              </div>
              <div className="flex flex-col p-4 hover:bg-muted">
                <Label className="text-muted-foreground">Employee</Label>
                <Label className="text-md pt-1">employeeId</Label>
              </div> */}
            </div> 
          </div>


        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No activity selected
        </div>
      )}
    </div>
  )
}