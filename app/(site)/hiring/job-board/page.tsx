"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import apiClient from "@/lib/api/api-client";
import { Reports } from "@/types/reports";
import toast from "react-hot-toast";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";
import { CircleAlert } from "lucide-react";
import { useState } from "react";
import { dateObjectToString, timeObjectToString } from "@/lib/utils/time-utils";
import { addMonths } from "date-fns";
import { Button } from "@/components/ui/button";

const JobBoardPage = () => {

    const { user } = useAuth();
 
    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <Heading title={`Job Board (3)`} description="Manage your candidates" /> 
                        <Button>
                          Hey
                        </Button>
                    </div>
                    <Separator /> 
                    

                </div>
            </div>
        </>)
}

export default JobBoardPage;