"use client";

import { Loader } from "lucide-react";
import { useState } from "react";
import { DeductionClient } from "./client";
import { allowances } from "../../../data";

export const DeductionsPage = () => {

    const [isLoading, setLoading] = useState(true)

    return (
        <>
            <div className="flex-col">
                <div className="flex-1">
                    {!isLoading ?
                        (
                            <div className="grid h-screen place-items-center">
                                <Loader />
                            </div>
                        )
                        : (<DeductionClient data={allowances} />)}
                </div>
            </div>
        </>
    )
}

export default DeductionsPage;