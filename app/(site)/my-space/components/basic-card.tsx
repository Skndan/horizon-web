"use client"

import { Label } from "@/components/ui/label"
import { toTitleCase } from "@/lib/utils/string-utils";
import { formatDate } from "@/lib/utils/time-utils";
import { Profile } from "@/types/profile"

interface BasicCardProps {
    profile: Profile | null;
};


export const BasicCard: React.FC<BasicCardProps> = ({
    profile,
}) => {

    return (
        <>
            <div className="grid md:grid-cols-3 rounded-md border">
                <div className="flex flex-col p-4 hover:bg-muted">
                    <Label className="text-muted-foreground">Employee ID</Label>
                    <Label className="text-md pt-1">{profile?.employeeId}</Label>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted">
                    <Label className="text-muted-foreground">Name</Label>
                    <Label className="text-md pt-1">{profile?.name}</Label>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted">
                    <Label className="text-muted-foreground">Mobile</Label>
                    <Label className="text-md pt-1">{profile?.mobile}</Label>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted">
                    <Label className="text-muted-foreground">Office Email</Label>
                    <Label className="text-md pt-1">{profile?.email}</Label>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted">
                    <Label className="text-muted-foreground">Gender</Label>
                    <Label className="text-md pt-1">{toTitleCase(profile?.gender ?? '')}</Label>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted">
                    <Label className="text-muted-foreground">Date of Birth</Label>
                    <Label className="text-md pt-1">{profile?.dateOfBirth && formatDate(profile?.dateOfBirth, 'dd MMM yyyy')}</Label>
                </div>
            </div>

        </>
    )
}