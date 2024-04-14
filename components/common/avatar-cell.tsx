import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "../ui/label";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AvatarCell = ({ avatarUrl, employeeName, employeeCode, employeeId }: { avatarUrl: string, employeeName: string, employeeCode: string, employeeId: string }) => {
    const pathname = usePathname();
    return <>
        <Link href={{ pathname: `/organisation/employee/view/${employeeId}`, query: { redirect: pathname } }}>
            {/* <Link href={`/organisation/employee/view/${employeeId}`}> */}
            <div className="flex flex-row items-center hover:underline">
                <Avatar>
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>HZ</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start pl-2">
                    <Label >{employeeName}</Label>
                    <Label className="pt-2 text-muted-foreground">{employeeCode}</Label>
                </div>
            </div>
        </Link>
    </>;
};

export default AvatarCell;