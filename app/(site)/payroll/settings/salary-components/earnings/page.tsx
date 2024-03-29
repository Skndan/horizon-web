"use client";

import { Loader } from "lucide-react";
import { useState } from "react";
import { EarningClient } from "./client";
import { allowances } from "../../../data";

const EarningsPage = () => {


    // const [data, setData] = useState<Profile[]>([])
    const [isLoading, setLoading] = useState(true)

    return (
        <><div className="flex-col">
            <div className="flex-1">
                {!isLoading ?
                    (
                        <div className="grid h-screen place-items-center">
                            <Loader className="animate-spin h-5 w-5 mr-3" />
                        </div>
                    )
                    : (<EarningClient data={allowances} />)}
            </div>
        </div>
        </>)
}

export default EarningsPage;