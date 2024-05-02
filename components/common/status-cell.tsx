import { toTitleCase } from "@/lib/utils/string-utils";
import { Label } from "../ui/label";

const StatusCell = ({ status }: { status: string }) => {


    var ripple = <></>;

    /**
     
    status == "INITIATED" ? <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
            </span> : <></>
     */
    switch (status) {
        case "INITIATED":
        case "DRAFT":
            ripple = <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
            </span>
            break; 
        case "APPROVED":
            ripple = <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
            </span>
            break;
        case "REJECTED":
            ripple = <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-400"></span>
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