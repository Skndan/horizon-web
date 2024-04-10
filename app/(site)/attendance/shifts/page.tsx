"use client";

import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { ShiftTable } from "./_components/client";
import { Shift } from "@/types/attendance";


const AttendanceShiftPage = () => {

    const [data, setData] = useState<Shift[]>([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
              // console.log("Latitude: ", position.coords.latitude);
              // console.log("Longitude: ", position.coords.longitude);
            }, function(error) {
              console.error("Error: ", error);
            }, {
              enableHighAccuracy: true, // Request high accuracy
              maximumAge: 0
            });
          } else {
            // console.log("Geolocation is not supported by this browser.");
          }

        apiClient.get('/shift').then((res) => res.data)
            .then((data) => {
                setData(data.content)
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
                    : (<ShiftTable data={data} />)}
            </div>
        </div>)
}

export default AttendanceShiftPage;