"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { CandidateForm } from "./candidate-form";


const CandidatePage = ({ params }: { params: { candidateId: string } }) => {

  const [data, setData] = useState(null);

  const [isLoading, setLoading] = useState(true)
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      if (params.candidateId != 'new') {
        const candidate = await apiClient.get(`/candidate/${params.candidateId}`);
        setData(candidate.data)
        setLoading(false)
      }

      setLoading(false);
    })()
  }, [params.candidateId])

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {isLoading ? (
          <div className="grid h-screen place-items-center">
            <Loader className="animate-spin h-5 w-5 mr-3" />
          </div>
        ) : (
          <CandidateForm
            initialData={data} />)}
      </div>
    </div>)
}

export default CandidatePage;