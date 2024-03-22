"use client";

import { useEffect, useState } from "react";
import { EmployeeForm } from "./components/employee-form";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { Department, Location, Profile } from "@/types/profile";


const OnboardingPage = ({ params }: { params: { employeeId: string } }) => {

    const [data, setData] = useState(null);
    const [org, setOrg] = useState(null);

    const [isLoading, setLoading] = useState(false)

    const [department, setDepartment] = useState<Department[]>([])
    const [location, setLocation] = useState<Location[]>([])
    const [profile, setProfile] = useState<Profile[]>([])

    useEffect(() => {
        (async () => {
            setLoading(true);

            if (params.employeeId != 'new') {
                const employees = await apiClient.get(`/profile/${params.employeeId}`);
                setData(employees.data)
            }

            // var orgId = localStorage.getItem("orgId");
            // setOrg(orgId);

            const departments = await apiClient.get(`/department`);
            setDepartment(departments.data.content)

            const locations = await apiClient.get(`/location`);
            setLocation(locations.data.content)

            const profiles = await apiClient.get(`/profile`);
            setProfile(profiles.data.content) 

            setLoading(false);
        })()
    }, [])
 
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">

                {isLoading ? (
                    <div className="grid h-screen place-items-center">
                        <Loader />
                    </div>
                ) : (
                    <EmployeeForm 
                        department={department}
                        location={location}
                        profile={profile} 
                        initialData={data}
                        orgId={org}
                    />)}
            </div>
        </div>)
}

export default OnboardingPage;