"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { WorkflowForm } from "./workflow-form";


const WorkflowPage = ({ params }: { params: { workflowId: string } }) => {

  const [data, setData] = useState(null);

  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      if (params.workflowId != 'new') {
        setLoading(true)
        const candidate = await apiClient.get(`/workflow/${params.workflowId}`);
        setData(candidate.data)
        setLoading(false)
      }
    })()
  }, [params.workflowId])

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {isLoading ? (
          <div className="grid h-screen place-items-center">
            <Loader className="animate-spin h-5 w-5 mr-3" />
          </div>
        ) : (
          <WorkflowForm
            initialData={data} />)}
      </div>
    </div>)
}

export default WorkflowPage;