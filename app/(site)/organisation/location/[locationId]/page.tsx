"use client";

import { useEffect, useState } from "react";
import LocationFormPage from "./client";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";


const LocationForm = ({
    params
}: {
    params: { locationId: string }
}) => {

    const [data, setData] = useState(null);

    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true);
            if (params.locationId != 'new') {
                const products = await apiClient.get(`/location/${params.locationId}`);
                setData(products.data)
            } 
            setLoading(false);
        })()
    }, [])

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4">
                {isLoading ? (
                    <div className="grid h-screen place-items-center">
                        <Loader className="animate-spin h-5 w-5 mr-3" />
                    </div>
                ) : (
                    <LocationFormPage initialData={data} />
                )}
            </div>
        </div>
    );
}

export default LocationForm;
