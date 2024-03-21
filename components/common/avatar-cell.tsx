import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const AvatarCell = ({ avatarUrl }: { avatarUrl: string }) => {
    return <>
        <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    </>;
};

export default AvatarCell;