"use client"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { toTitleCase } from "@/lib/utils/string-utils";
import { formatDate } from "@/lib/utils/time-utils";
import { Interview } from "@/types/hiring"
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

interface CandidateInfoProp {
    interview: Interview | null;
};


export const CandidateInfo: React.FC<CandidateInfoProp> = ({
    interview
}) => {

    const onCopy = (id: string, name: string) => {
        navigator.clipboard.writeText(id);
        toast.success(`${name} copied to clipboard.`);
    }

    return (
        <>
            <div className="flex flex-col mt-4">
                <div className="flex flex-col p-4 hover:bg-muted">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <Label className="text-muted-foreground">Application Number</Label>
                            <Label className="text-md pt-1">#{interview?.candidate.applicationNumber}</Label>
                        </div>
                        <Button className="hover:bg-primary" size={"icon"} variant={"outline"} onClick={() => onCopy(`${interview?.candidate.applicationNumber}`, "Application Number")}>
                            <Copy className="top-2.5 h-4 w-4 text-foreground" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <Label className="text-muted-foreground">Name</Label>
                            <Label className="text-md pt-1">{interview?.candidate.name}</Label>
                        </div>
                        <Button className="hover:bg-primary" size={"icon"} variant={"outline"} onClick={() => onCopy(`${interview?.candidate.name}`, "Name")}>
                            <Copy className="top-2.5 h-4 w-4 text-foreground" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <Label className="text-muted-foreground">Mobile</Label>
                            <Label className="text-md pt-1">{interview?.candidate.mobile}</Label>
                        </div>
                        <Button className="hover:bg-primary" size={"icon"} variant={"outline"} onClick={() => onCopy(`${interview?.candidate.mobile}`, "Mobile")}>
                            <Copy className="top-2.5 h-4 w-4 text-foreground" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <Label className="text-muted-foreground">Email</Label>
                            <Label className="text-md pt-1">{interview?.candidate.email}</Label>
                        </div>
                        <Button className="hover:bg-primary" size={"icon"} variant={"outline"} onClick={() => onCopy(`${interview?.candidate.email}`, "Email")}>
                            <Copy className="top-2.5 h-4 w-4 text-foreground" />
                        </Button>
                    </div>
                </div>
                {/* <div className="flex flex-col p-4 hover:bg-muted">
                    <Label className="text-muted-foreground">Gender</Label>
                    <Label className="text-md pt-1">{toTitleCase(interview?.candidate.email ?? '')}</Label>
                </div> */}
                {/* <div className="flex flex-col p-4 hover:bg-muted border">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <Label className="text-muted-foreground">Date of Birth</Label>
                            <Label className="text-md pt-1">{profile?.dateOfBirth && formatDate(profile?.dateOfBirth, 'dd MMM yyyy')}</Label>
                        </div> 
                    </div>
                </div> */}
            </div>
        </>
    )
}