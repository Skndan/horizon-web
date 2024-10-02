"use client";

import { SubHeading } from "@/components/ui/sub-heading";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/api-client";
import { useAuth } from "@/context/auth-provider";
import { Candidate } from "@/types/hiring";

const CandidatePage = ({ params }: { params: { candidateId: string } }) => {

  const { user } = useAuth();
  const [data, setData] = useState<Candidate | null>(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    apiClient.get<Candidate>(`/candidate/${params.candidateId}`).then((res) => res.data)
      .then((data) => {
        setData(data)
        setLoading(false)
      });
  }, [])


  return (
    <>
      <div className="space-y-6">
        {/* <SubHeading title="Basic Information" description="" />
                <BasicCard profile={data} />
                <SubHeading title="Work Information" description="" />
                <WorkCard profile={data} /> */}
      </div>
    </>)
}

export default CandidatePage;