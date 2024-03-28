import { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMail } from "@/store/use-mail-store"
import { Activity } from "@/types/activity"
import { formatDistanceToNow } from "date-fns"
import { MailDisplay } from "./mail-display"
import { EmptyStateTable } from "@/components/common/empty-state-table"
import { toTitleCase } from "@/lib/utils/string-utils"

interface MailListProps {
  items: Activity[]
}

export function MailList({ items }: MailListProps) {

  const [mail, setMail] = useMail()

  return (
    <>
      <ScrollArea className="h-screen ">
        <div className="flex flex-col gap-2 py-4 pt-0">
          {
            items.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                  mail.selected === item.id && "bg-muted"
                )}
                onClick={() =>
                  setMail({
                    ...mail,
                    selected: item.id,
                  })
                }
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{item.initiator.name}</div>
                    </div>

                    <div className="ml-auto flex gap-2 items-center">
                      <Badge className={`${item.type == "ACTIVITY" ? "bg-green-400" : "bg-amber-400"}`}>
                        {toTitleCase(item.type)}
                      </Badge>
                      <div
                        className={cn(
                          "text-xs",
                          mail.selected === item.id
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatDistanceToNow(new Date(item.updatedAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-md font-medium">{item.name}</div>
                </div>
                <div className="line-clamp-2 text-xs text-muted-foreground"> 
                  <p dangerouslySetInnerHTML={{ __html: item.description.substring(0, 300) }}></p>
                </div>
                {item.attendies.length ? (
                  <div className="flex items-center gap-2">
                    {item.attendies.map((label) => (
                      <Badge key={label.id}>
                        {label.name}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </button>
            ))
          }
          {items.length == 0 ?
            <EmptyStateTable title={"No activities/events found"} description={""} action={null} onClick={function (): void {
              throw new Error("Function not implemented.")
            }} /> : <></>
          }
        </div>
      </ScrollArea>
    </>

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