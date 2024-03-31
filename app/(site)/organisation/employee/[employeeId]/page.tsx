"use client";

import { useEffect, useState } from "react";
import { EmployeeForm } from "./components/employee-form";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { Department, Address, Profile } from "@/types/profile";
import { Shift } from "@/types/attendance";
import { useAuth } from "@/context/auth-provider";


const OnboardingPage = ({ params }: { params: { employeeId: string } }) => {

    const [data, setData] = useState(null);

    const [isLoading, setLoading] = useState(false)

    const [department, setDepartment] = useState<Department[]>([])
    const [location, setLocation] = useState<Address[]>([])
    const [profile, setProfile] = useState<Profile[]>([])
    const [shifts, setShifts] = useState<Shift[]>([])
    const {user} = useAuth();

    useEffect(() => {
        (async () => {
            setLoading(true);

            if (params.employeeId != 'new') {
                const employees = await apiClient.get(`/profile/${params.employeeId}`);
                setData(employees.data)
            }

            const departments = await apiClient.get(`/department`);
            setDepartment(departments.data.content)

            const locations = await apiClient.get(`/address/get-by-organisation/${user?.orgId}`);
            setLocation(locations.data)

            const profiles = await apiClient.get(`/profile`);
            setProfile(profiles.data.content)

            const shifts = await apiClient.get(`/shift`);
            setShifts(shifts.data.content)

            setLoading(false);
        })()
    }, [params.employeeId])

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">

                {isLoading ? (
                    <div className="grid h-screen place-items-center">
                        <Loader className="animate-spin h-5 w-5 mr-3" />
                    </div>
                ) : (
                    <EmployeeForm
                        department={department}
                        address={location}
                        profile={profile}
                        shifts={shifts}
                        initialData={data}
                        orgId={null}
                    />)}
            </div>
        </div>)
}

export default OnboardingPage;