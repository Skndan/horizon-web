"use client"

import * as React from "react"
import {
  AlertCircle,
  Archive,
  ArchiveX,
  Ban,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react"
import addDays from "date-fns/addDays"
import addHours from "date-fns/addHours"
import format from "date-fns/format"
import nextSaturday from "date-fns/nextSaturday"
import {
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useMail } from "@/store/use-mail-store"
import { MailList } from "./mail-list"
import { type Mail } from "./data"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/auth-provider"
import { useEffect, useState } from "react"
import { Interview, InterviewLine } from "@/types/hiring"
import apiClient from "@/lib/api/api-client"
import { Label } from "@/components/ui/label"
import { EmptyStateTable } from "@/components/common/empty-state-table"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import DateTimeCell from "@/components/common/date-time-cell"
import { toTitleCase } from "@/lib/utils/string-utils"
import dynamic from "next/dynamic"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MailProps {
  interviewId: string
}

const formSchema = z.object({
  interview: z.any(),
  workflowLine: z.any().optional(),
  score: z.any().optional(),
  remarks: z.any().optional(),
  disQualified: z.any().optional(),
});

type TimesheetFormValues = z.infer<typeof formSchema>


export function Mail({
  interviewId,
}: MailProps) {
  const [mail] = useMail()

  const { user } = useAuth();
  const [data, setData] = useState<Interview | null>(null)
  const [line, setLine] = useState<InterviewLine[]>([])
  const [isLoading, setLoading] = useState(true)

  const form = useForm<TimesheetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interview: {
        id: ''
      },
      workflowLine: {
        id: ''
      },
    }
  });

  const handleCommentChange = (content: string) => {
    form.setValue('remarks', content); // Update the form field when ProseMirror content changes
  };

  // const onSubmit = (data: FormData) => {
  //   console.log('Submitted data:', data);
  // };

  const onSubmit = async (formValues: TimesheetFormValues) => {
    try {

      formValues.interview.id = data?.id;
      formValues.workflowLine.id = data?.latestTransition.id;

      console.log(formValues)

      await apiClient
        .post(`/interview/line`, formValues)
        .then((res) => res.data)
        .then(async (data) => {
          await apiClient.get(`/interview/line/get-by-interview/${interviewId}`).then((res) => res.data)
            .then((data) => {
              setLine(data.content)
            });

        });
        
      form.reset();

    } catch (error: any) {

    }
  };


  async function fetchData() {
    await apiClient.get<Interview>(`/interview/${interviewId}`).then((res) => res.data)
      .then((data) => {
        setData(data)
      });

    await apiClient.get(`/interview/line/get-by-interview/${interviewId}`).then((res) => res.data)
      .then((data) => {
        setLine(data.content)
      });

    setLoading(false)
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <TooltipProvider delayDuration={0}>
      <div className="m-4 border rounded-md">
        <div className="items-stretch grid sm:grid-cols-2 grid-cols-1">

          <Tabs defaultValue="overview">
            <div className="flex items-center px-4 py-2">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-bold">{data?.candidate.name}</h1>
                <Label className="text-muted-foreground">{data?.candidate.position.title}</Label>
              </div>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="overview"
                  className="text-zinc-600 dark:text-zinc-200">
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200">
                  Files
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <TabsContent value="overview" className="m-0">
              <MailList interview={data} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <EmptyStateTable title={""} description={""} action={null} onClick={function (): void {
                throw new Error("Function not implemented.")
              }} />
            </TabsContent>
          </Tabs>

          <div className="flex h-full flex-col border-l">
            <div className="flex items-center p-2">
              <div className="flex items-center gap-2">
                <Badge className="text-foreground">{data?.latestTransition.transitionName}</Badge>
                {/* <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!mail}>
                      <Archive className="h-4 w-4" />
                      <span className="sr-only">Archive</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Archive</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!mail}>
                      <ArchiveX className="h-4 w-4" />
                      <span className="sr-only">Move to junk</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Move to junk</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!mail}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Move to trash</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Move to trash</TooltipContent>
                </Tooltip>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!mail}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Move to trash</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Move to trash</TooltipContent>
                </Tooltip> */}
              </div>
              <div className="ml-auto flex items-center gap-2">
                {/* <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!mail}>
                      <Reply className="h-4 w-4" />
                      <span className="sr-only">Reply</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reply</TooltipContent>
                </Tooltip> */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="hover:text-red-500" size="icon">
                      <Ban className="h-4 w-4" />
                      <span className="sr-only">Disqualify</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Disqualify</TooltipContent>
                </Tooltip>
                <Separator orientation="vertical" className="mx-1 h-6" />

                <Button variant="outline" disabled={!mail}>
                  <Label className="p-2">Proceed</Label>
                  <Forward className="h-4 w-4" />
                  <span className="sr-only">Forward</span>
                </Button>

              </div>
              <Separator orientation="vertical" className="mx-2 h-6" />
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
                      <AvatarImage alt={"asdfasfd"} />
                      <AvatarFallback>
                        {data?.candidate.position.hiringLead.name
                          .split(" ")
                          .map((chunk) => chunk[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="font-semibold">{data?.candidate.position.hiringLead.name}</div>
                      <div className="line-clamp-1 text-xs">{"Hiring Lead"}</div>
                    </div>
                  </div>
                </div>
                <Separator />


                <ScrollArea className="h-96 p-4">
                  {
                    line.length == 0 ? <EmptyStateTable title={"No line"} description={"No line"} action={null} onClick={function (): void {
                      throw new Error("Function not implemented.");
                    }} /> :

                      <div className="space-y-4">
                        {line.map((s) => {
                          return <Alert key={s.id}>
                            <AlertTitle>
                              {toTitleCase(s.workflowLine.approver.name)}
                            </AlertTitle>
                            <AlertDescription className="text-foreground">
                              <div className="flex flex-col">
                                <div
                                  dangerouslySetInnerHTML={{ __html: s.remarks }}
                                />
                                <div className="flex flex-row justify-end text-foreground">
                                  <DateTimeCell dateStr={s.updatedAt} isTime={2} />
                                </div>
                              </div>
                            </AlertDescription>
                          </Alert>
                        })}
                      </div>

                  }
                </ScrollArea>

                <Separator />
                <div className="p-4 flex-1">

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                      <FormField
                        control={form.control}
                        name="remarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <ReactQuill
                                value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center">
                        {/* <Label
                          htmlFor="mute"
                          className="flex items-center gap-2 text-xs font-normal"
                        >
                          <Switch id="mute" aria-label="Mute thread" /> Mute this
                          thread
                        </Label> */}
                        <Button
                          type="submit"
                          className="ml-auto"
                        >
                          Send
                        </Button>
                      </div>
                    </form>
                  </Form>


                  {/* <form>
                    <div className="grid gap-4">
                      <Textarea
                        className="p-4"
                        placeholder={`Reply ${"asfdasdf"}...`}
                      />
                      <div className="flex items-center">
                        <Label
                          htmlFor="mute"
                          className="flex items-center gap-2 text-xs font-normal"
                        >
                          <Switch id="mute" aria-label="Mute thread" /> Mute this
                          thread
                        </Label>
                        <Button
                          onClick={(e) => e.preventDefault()}
                          size="sm"
                          className="ml-auto"
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </form> */}


                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No message selected
              </div>
            )}
          </div>

        </div>
      </div>
    </TooltipProvider>
  )
}