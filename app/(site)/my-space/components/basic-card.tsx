"use client"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { toTitleCase } from "@/lib/utils/string-utils";
import { formatDate } from "@/lib/utils/time-utils";
import { Profile } from "@/types/profile"
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

interface BasicCardProps {
    profile: Profile | null;
};


export const BasicCard: React.FC<BasicCardProps> = ({
    profile,
}) => {

    const onCopy = (id: string, name: string) => {
        navigator.clipboard.writeText(id);
        toast.success(`${name} copied to clipboard.`);
    }

    return (
        <>
            <div className="grid md:grid-cols-3 rounded-md border">
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <Label className="text-muted-foreground">Employee ID</Label>
                            <Label className="text-md pt-1">{profile?.employeeId}</Label>
                        </div>
                        <Button className="hover:bg-primary" size={"icon"} variant={"outline"} onClick={() => onCopy(`${profile?.employeeId}`, "Employee ID")}>
                            <Copy className="top-2.5 h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <Label className="text-muted-foreground">Name</Label>
                            <Label className="text-md pt-1">{profile?.name}</Label>
                        </div>
                        <Button className="hover:bg-primary" size={"icon"} variant={"outline"} onClick={() => onCopy(`${profile?.name}`, "Name")}>
                            <Copy className="top-2.5 h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <Label className="text-muted-foreground">Mobile</Label>
                            <Label className="text-md pt-1">{profile?.mobile}</Label>
                        </div>
                        <Button className="hover:bg-primary" size={"icon"} variant={"outline"} onClick={() => onCopy(`${profile?.mobile}`, "Mobile")}>
                            <Copy className="top-2.5 h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <Label className="text-muted-foreground">Office Email</Label>
                            <Label className="text-md pt-1">{profile?.email}</Label>
                        </div>
                        <Button className="hover:bg-primary" size={"icon"} variant={"outline"} onClick={() => onCopy(`${profile?.email}`, "Office Email")}>
                            <Copy className="top-2.5 h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <Label className="text-muted-foreground">Gender</Label>
                    <Label className="text-md pt-1">{toTitleCase(profile?.gender ?? '')}</Label>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <Label className="text-muted-foreground">Date of Birth</Label>
                            <Label className="text-md pt-1">{profile?.dateOfBirth && formatDate(profile?.dateOfBirth, 'dd MMM yyyy')}</Label>
                        </div>
                        <Button className="hover:bg-primary" size={"icon"} variant={"outline"} onClick={() => onCopy(`${profile?.dateOfBirth && formatDate(profile?.dateOfBirth, 'dd MMM yyyy')}`, "Date of Birth")}>
                            <Copy className="top-2.5 h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}