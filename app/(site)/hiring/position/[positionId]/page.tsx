"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { PositionForm } from "./position-form";


const PositionPage = ({ params }: { params: { positionId: string } }) => {

  const [data, setData] = useState(null);

  const [isLoading, setLoading] = useState(false)
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      if (params.positionId != 'new') {
        setLoading(true)
        const candidate = await apiClient.get(`/position/${params.positionId}`);
        setData(candidate.data)
        setLoading(false)
      }
    })()
  }, [params.positionId])

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {isLoading ? (
          <div className="grid h-screen place-items-center">
            <Loader className="animate-spin h-5 w-5 mr-3" />
          </div>
        ) : (
          <PositionForm
            initialData={data} />)}
      </div>
    </div>)
}

export default PositionPage;