"use client";

import { useEffect, useState } from "react";
import { EmployeeForm } from "./components/employee-form";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import { Department, Address, Profile, Account } from "@/types/profile";
import { Shift } from "@/types/attendance";
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";


const OnboardingPage = ({ params }: { params: { employeeId: string } }) => {

    const [data, setData] = useState(null);

    const [isLoading, setLoading] = useState(false)

    const [department, setDepartment] = useState<Department[]>([])
    const [location, setLocation] = useState<Address[]>([])
    const [profile, setProfile] = useState<Profile[]>([])
    const [shifts, setShifts] = useState<Shift[]>([])
    const [accounts, setAccounts] = useState(null)
    const searchParams = useSearchParams()

    const { user } = useAuth();

    useEffect(() => {
        (async () => {
            setLoading(true);

            if (params.employeeId != 'new') {
                const employees = await apiClient.get(`/profile/${params.employeeId}`);
                setData(employees.data)

                await apiClient.get(`/account/get-by-profile/${params.employeeId}`).
                    then((res) => res.data)
                    .then((data) => {
                        setAccounts(data)
                        setLoading(false)
                    }).catch(error => {
                        // Handle errors
                        if (error.response) {
                            // The request was made and the server responded with a status code
                            // that falls out of the range of 2xx
                            if (error.response.status === 400) {
                                console.log('Bad request:', error.response.data);
                                // Inform the user about the bad request
                                // alert('Bad request. Please check your input.');
                            } else {
                                // For other errors, log the error message
                                console.log('Error:', error.message);
                            }
                        } else {
                            // The request was made but no response was received
                            console.log('Error:', error.message);
                        }
                    })

            }

            const departments = await apiClient.get(`/department`);
            setDepartment(departments.data.content)

            const locations = await apiClient.get(`/address/get-by-organisation/${user?.orgId}`);
            setLocation(locations.data)

            const profiles = await apiClient.get(`/profile?pageSize=100`);
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
                        orgId={user?.orgId}
                        tab={`${searchParams.get('tab')}`}
                        initialDataAccount={accounts} />)}
            </div>
        </div>)
}

export default OnboardingPage;