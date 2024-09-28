"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { InterviewForm } from "./interview-form";


const PositionPage = ({ params }: { params: { interviewId: string } }) => {

  const [data, setData] = useState(null);

  const [isLoading, setLoading] = useState(false)
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      if (params.interviewId != 'new') {
        setLoading(true)
        const interview = await apiClient.get(`/interview/${params.interviewId}`);
        setData(interview.data)
        setLoading(false)
      }
    })()
  }, [params.interviewId])

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {isLoading ? (
          <div className="grid h-screen place-items-center">
            <Loader className="animate-spin h-5 w-5 mr-3" />
          </div>
        ) : (
          <InterviewForm
            initialData={data} />)}
      </div>
    </div>)
}

export default PositionPage;