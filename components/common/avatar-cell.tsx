import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "../ui/label";

const AvatarCell = ({ avatarUrl, employeeName, employeeId }: { avatarUrl: string, employeeName: string, employeeId: string }) => {
    return <>
        <div className="flex flex-row items-center">
            <Avatar>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>HZ</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start pl-2">
                <Label>{employeeName}</Label>
                <Label className="pt-2 text-muted-foreground">{employeeId}</Label>
            </div>
        </div>

    </>;
};

export default AvatarCell;