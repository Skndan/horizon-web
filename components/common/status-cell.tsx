import { toTitleCase } from "@/lib/utils/string-utils";
import { Label } from "../ui/label";

const StatusCell = ({ status }: { status: string }) => {


    var ripple = <></>;

    /** 
NOTICE  
    status == "INITIATED" ? <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
            </span> : <></>
     */
    switch (status) {
        case "INITIATED":
        case "DRAFT":
        case "HOLD":
        case "PROBATION":
            ripple = <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
            </span>
            break;
        case "APPROVED":
        case "HIRING":
        case "ACTIVE":
            ripple = <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
            </span>
            break;
        case "REJECTED":
        case "CLOSED":
        case "RESIGNED":
        case "TERMINATED":
            ripple = <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-400"></span>
            </span>
            break;
        case "DECEASED":
            ripple = <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-stone-400"></span>
            </span>
            break;
        case "NOTICE":
            ripple = <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
            </span>
            break;
    }

    return <>
        <div className="flex flex-row items-center gap-2">
            {toTitleCase(status)}
            {ripple}
        </div>

    </>;
};

export default StatusCell;