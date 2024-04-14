"use client"

import { Label } from "@/components/ui/label"
import { toTitleCase } from "@/lib/utils/string-utils";
import { formatDate } from "@/lib/utils/time-utils";
import { Profile } from "@/types/profile";

interface WorkCardProps {
    profile: Profile | null;
};

export const WorkCard: React.FC<WorkCardProps> = ({
    profile,
}) => {
    return (
        <>
            <div className="grid md:grid-cols-3 rounded-md border">
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <Label className="text-muted-foreground">Shift</Label>
                    <Label className="text-md pt-1">{profile?.shift.name}</Label>
                </div>
                <div className="flex flex-col  p-4 hover:bg-muted border">
                    <Label className="text-muted-foreground">Department</Label>
                    <Label className="text-md pt-1">{profile?.department.name}</Label>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <Label className="text-muted-foreground">Office</Label>
                    <Label className="text-md pt-1">{profile?.address && profile?.address.label}</Label>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <Label className="text-muted-foreground">Reporting Manager</Label>
                    <Label className="text-md pt-1">{profile?.reportingManager && profile?.reportingManager.name}</Label>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <Label className="text-muted-foreground">Date of joining</Label>
                    <Label className="text-md pt-1">{profile?.dateOfJoining && formatDate(profile?.dateOfJoining, "dd MMM yyyy")}</Label>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <Label className="text-muted-foreground">Employee Status</Label>
                    <Label className="text-md pt-1">{toTitleCase(profile?.employeeStatus ?? '')}</Label>
                </div>
            </div>
        </>
    )
}