import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import Image from "next/image";

interface HeadingProps {
    title: string;
    description: string;
    action: string | null;
    onClick: () => void;
}

export const EmptyStateTable: React.FC<HeadingProps> = ({
    title,
    description,
    action,
    onClick
}) => {

    const router = useRouter();

    return (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">

                <Image
                    src="/empty-folder2.png"
                    width="100"
                    height="56"
                    alt="Empty-Folder"
                />

                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    {description}
                </p>
                {action && <Button size="sm" className="relative" onClick={onClick}>
                    {action}
                </Button>}

            </div>
        </div>
    )
}