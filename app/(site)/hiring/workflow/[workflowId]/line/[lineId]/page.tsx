"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { WorkflowLineForm } from "./workflow-line-form";


const WorkflowPage = ({ params }: { params: { lineId: string } }) => {

  const [data, setData] = useState(null);

  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      if (params.lineId != 'new') {
        setLoading(true)
        const candidate = await apiClient.get(`/workflow/${params.lineId}`);
        setData(candidate.data)
        setLoading(false)
      }
    })()
  }, [params.lineId])

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {isLoading ? (
          <div className="grid h-screen place-items-center">
            <Loader className="animate-spin h-5 w-5 mr-3" />
          </div>
        ) : (
          <WorkflowLineForm
            initialData={data} workflowId={params.lineId} />)}
      </div>
    </div>)
}

export default WorkflowPage;