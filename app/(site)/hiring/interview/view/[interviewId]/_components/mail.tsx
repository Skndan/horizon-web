"use client"

import * as React from "react"
import {
  Ban,
  Loader,
} from "lucide-react"
import {
  Forward,
  MoreVertical,
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { MailList } from "./mail-list"
import { type Mail } from "./data"
import { useAuth } from "@/context/auth-provider"
import { useEffect, useState } from "react"
import { Interview, InterviewLine, WorkflowLine } from "@/types/hiring"
import apiClient from "@/lib/api/api-client"
import { Label } from "@/components/ui/label"
import { EmptyStateTable } from "@/components/common/empty-state-table"
import DateTimeCell from "@/components/common/date-time-cell"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import toast from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { MinimalTiptapEditor } from "@/components/minimal-tiptap"

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

const formSchema2 = z.object({
  interview: z.any(),
  workflowLine: z.any().optional(),
  score: z.any().optional(),
  remarks: z.any().optional(),
  disQualified: z.any().optional(),
});

type TimesheetFormValues2 = z.infer<typeof formSchema2>

export function Mail({
  interviewId,
}: MailProps) {

  const { user } = useAuth();
  const [data, setData] = useState<Interview | null>(null)
  const [line, setLine] = useState<InterviewLine[]>([])
  const [isLoading, setLoading] = useState(true)
  const [open, setOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

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

  const form2 = useForm<TimesheetFormValues2>({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      interview: {
        id: ''
      },
      workflowLine: {
        id: ''
      },
    }
  });

  const onSubmit = async (formValues: TimesheetFormValues) => {
    try {

      formValues.interview.id = data?.id;
      formValues.workflowLine.id = data?.latestTransition.id;

      await apiClient
        .post(`/interview/line`, formValues)
        .then((res) => res.data)
        .then(async (data) => {
          toast.success("Your remarks submitted!")
          await fetchData();
        });

      form.reset();
      form2.reset();
      setOpen(false);
    } catch (error: any) {

    }
  };


  async function fetchData() {
    await apiClient.get<Interview>(`/interview/${interviewId}`).then((res) => res.data)
      .then(async (data) => {
        setData(data);
        await apiClient.get(`/interview/line/get-by-interview/${interviewId}/${user?.profileId}`).then((res) => res.data)
          .then((data) => {
            setLine(data)
          });

      });


    setLoading(false)
  }

  async function updateStatus(newLine: WorkflowLine) {

    setStatusLoading(true);
    // check if we have a remark and the proceed
    await apiClient.post<Interview>(`/interview/update-pipeline/${interviewId}/${data?.latestTransition.id}`, newLine).then((res) => res.data)
      .then((data) => {
        setData(data)
        setStatusLoading(false);
      }).catch((e) => {
        toast.error(e.response.data.message);
        setStatusLoading(false);
      });
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>
      <Dialog open={open} onOpenChange={(s) => setOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Disqualify Candidate</DialogTitle>
            <DialogDescription>
              {`Give a reason to disqualifying candidate.`}
            </DialogDescription>
          </DialogHeader>
          <Form {...form2}>
            <form onSubmit={form2.handleSubmit(onSubmit)} className="space-y-4 w-full">
              <FormField
                control={form2.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason <span className="text-red-600">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Reason for disqualification"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center">
                <Button
                  type="submit"
                  className="ml-auto">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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

            <div className="flex h-full flex-col border-t border-l">
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
                </Tooltip>  */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="hover:text-red-500" size="icon"
                        disabled={data?.disQualified ?? false}
                        onClick={(e) => {
                          form.reset();
                          form2.setValue("disQualified", true);
                          setOpen(true)
                        }}>
                        <Ban className="h-4 w-4" />
                        <span className="sr-only">Disqualify</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Disqualify</TooltipContent>
                  </Tooltip>
                  <Separator orientation="vertical" className="mx-1 h-6" />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {statusLoading &&
                          <Loader className="animate-spin h-5 w-5 mr-3" />}
                        <Label className="p-2">Proceed</Label>
                        <Forward className="h-4 w-4" />
                        <span className="sr-only">Forward</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {
                        data?.workflow.workflowLines
                          .sort((a, b) => a.transitionLevel - b.transitionLevel)
                          .map((size) => (
                            <DropdownMenuItem key={size.id} onClick={(e) => {
                              updateStatus(size);
                            }}>{size.transitionName}</DropdownMenuItem>
                          ))
                      }
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Separator orientation="vertical" className="mx-2 h-6" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={true}>
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
              <div className="flex flex-1 flex-col">
                <div className="flex items-start p-4">
                  <div className="flex items-start gap-4 text-sm">
                    <Avatar>
                      <AvatarImage alt={data?.candidate.position.hiringLead.name} />
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


                <ScrollArea className="h-96">
                  {
                    line.length == 0 ? <EmptyStateTable title={"No reviews yet"} description={"Be the one to review first"} action={null} onClick={function (): void {
                      throw new Error("Function not implemented.");
                    }} /> :

                      <div className="m-2 space-y-2">
                        {line.map((s) => {
                          return <div className="flex flex-col border rounded-md p-4" key={s.id}>
                            <div className="flex flex-row justify-between">
                              <div className="flex items-start gap-2 text-sm mb-4">
                                <Avatar>
                                  <AvatarImage alt={"asdfasfd"} />
                                  <AvatarFallback>
                                    {s.workflowLine.approver.name
                                      .split(" ")
                                      .map((chunk) => chunk[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                  <h4 className="font-semibold">{s.workflowLine.approver.name}</h4>
                                  <div className="line-clamp-1 text-xs">{s.workflowLine.approver.designation?.name ?? ""}</div>
                                </div>
                              </div>
                              <div className="flex flex-row justify-end text-foreground">
                                <DateTimeCell dateStr={s.updatedAt} isTime={2} />
                              </div>
                            </div>
                            <div className="text-foreground">
                              <div className="flex flex-col">
                                {s.disQualified ?
                                  <div className="flex flex-col gap-2">
                                    <Label>{s.remarks}</Label>
                                    <div className="flex">
                                      <Badge variant={"destructive"}>Disqualified</Badge>
                                    </div>
                                  </div> :
                                  <div
                                    dangerouslySetInnerHTML={{ __html: s.remarks }}
                                  />}
                              </div>
                            </div>
                          </div>
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
                              <MinimalTiptapEditor
                                value={field.value}
                                onChange={field.onChange}
                                className="w-full"
                                editorContentClassName="p-5"
                                output="html"
                                placeholder="Type your description here..."
                                autofocus={true}
                                editable={true}
                                editorClassName="focus:outline-none"
                              />
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
                          <Switch id="mute" aria-label="Mute thread" />
                          {(data?.latestTransition.approver.id !== user?.profileId) ? "hy" : "hx"}
                        </Label> */}
                        <Button disabled={(data?.disQualified ?? false) || (data?.latestTransition.approver.id !== user?.profileId)} type="submit" className="ml-auto">
                          Send
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  )
}