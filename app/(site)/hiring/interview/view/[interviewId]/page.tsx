import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { useAuth } from "@/context/auth-provider";
import { Interview } from "@/types/hiring";
import { cookies } from "next/headers"
import { Mail } from "./_components/mail";
import { accounts } from "@/app/(site)/dashboard/components/data";
import { mails } from "./_components/data";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const InterviewPage = ({ params }: { params: { interviewId: string } }) => {

  const layout = cookies().get("react-resizable-panels:layout:mail")
  const collapsed = cookies().get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined

  return (
    <>

      {/* <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <Heading title={`Interviews `} description="Manage your interview schedules" /> 
          </div>
          <Separator /> */}
      <Mail
        interviewId={params.interviewId}
      />
      {/* </div>
      </div> */}
    </>)
}

export default InterviewPage;