"use client";

import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { ShiftTable } from "./_components/client";
import { Shift } from "@/types/attendance";
import { useAuth } from "@/context/auth-provider";


const AttendanceShiftPage = () => {

  const [data, setData] = useState<Shift[]>([])
  const [total, setTotal] = useState(0);
  const [isLoading, setLoading] = useState(true)
  const {user} = useAuth();

  useEffect(() => {
    // if ("geolocation" in navigator) {
    //   navigator.geolocation.getCurrentPosition(function (position) {
    //     
    //     
    //   }, function (error) {
    //     console.error("Error: ", error);
    //   }, {
    //     enableHighAccuracy: true, // Request high accuracy
    //     maximumAge: 0
    //   });
    // } else {
    //   
    // }

    apiClient.get(`/shift/get-by-org/${user?.orgId}`).then((res) => res.data)
      .then((data) => {
        setData(data.content)
        setTotal(data.totalElements)
        setLoading(false)
      });
  }, [])

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {isLoading ?
          (
            <div className="grid h-screen place-items-center">
              <Loader className="animate-spin h-5 w-5 mr-3" />
            </div>
          )
          : (<ShiftTable data={data} total={total} />)}
      </div>
    </div>)
}

export default AttendanceShiftPage;