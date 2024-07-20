
"use client"
import { filterDuplicates } from "@/lib/utils/interface-utils";
import { EmployeeClient } from "./_components/client";
import apiClient from "@/lib/api/api-client";
import { Address, Department, Profile } from "@/types/profile";
import { Loader } from "lucide-react";

import { useEffect, useState } from "react";

const DirectoryPage = () => {

    const [data, setData] = useState<Profile[]>([])
    const [dept, setDept] = useState<Department[]>([])
    const [address, setAddress] = useState<Address[]>([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        apiClient.get('/profile').then((res) => res.data)
            .then((response) => {
                setData(response.content)
                if (response.length != 0) {
                    var dept = Array.from(data.map((e) => e.department))
                        .filter((element) => element !== null);
                    
                    setDept(filterDuplicates(dept, "id"));
                    
                    var address = Array.from(data.map((e) => e.address))
                        .filter((element) => element !== null);
                    
                    setAddress(filterDuplicates(address, "id"));
                    

                }
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
                    : (<EmployeeClient data={data} department={dept} address={address} />)}
            </div>
        </div>)
}

export default DirectoryPage;