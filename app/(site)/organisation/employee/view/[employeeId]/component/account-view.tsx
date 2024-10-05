"use client"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Account } from "@/types/profile"
import { Copy, Eye } from "lucide-react";
import toast from "react-hot-toast";

interface AccountCardProps {
    account: Account | null;
};


export const AccountCard: React.FC<AccountCardProps> = ({
    account,
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
                            <Label className="text-muted-foreground">Account Holder Name</Label>
                            <Label className="text-md pt-1">{account?.accountHolderName}</Label>
                        </div>
                        <Button className="hover:bg-primary" size={"icon"} variant={"outline"} onClick={() => onCopy(`${account?.accountHolderName}`, "Account Holder Name")}>
                            <Copy className="top-2.5 h-4 w-4 text-foreground" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <Label className="text-muted-foreground">Bank Name</Label>
                            <Label className="text-md pt-1">{account?.bankName}</Label>
                        </div>
                        <Button className="hover:bg-primary" size={"icon"} variant={"outline"} onClick={() => onCopy(`${account?.bankName}`, "Bank Name")}>
                            <Copy className="top-2.5 h-4 w-4 text-foreground" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <Label className="text-muted-foreground">Account Number</Label>
                            <Label className="text-md pt-1">{account?.accountNumber}</Label>
                        </div>
                        <Button className="hover:bg-primary" size={"icon"} variant={"outline"} onClick={() => onCopy(`${account?.accountNumber}`, "Account Number")}>
                            <Copy className="top-2.5 h-4 w-4 text-foreground" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <Label className="text-muted-foreground">IFSC Code</Label>
                            <Label className="text-md pt-1">{account?.ifscCode}</Label>
                        </div>
                        <Button className="hover:bg-primary" size={"icon"} variant={"outline"} onClick={() => onCopy(`${account?.ifscCode}`, "IFSC Code")}>
                            <Copy className="top-2.5 h-4 w-4 text-foreground" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <Label className="text-muted-foreground">PAN Number</Label>
                            <Label className="text-md pt-1">{account?.panNumber}</Label>
                        </div>
                        <Button className="hover:bg-primary" size={"icon"} variant={"outline"} onClick={() => onCopy(`${account?.panNumber}`, "PAN Number")}>
                            <Copy className="top-2.5 h-4 w-4 text-foreground" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col p-4 hover:bg-muted border">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <Label className="text-muted-foreground">UAN Number</Label>
                            <Label className="text-md pt-1">{account?.uanNumber}</Label>
                        </div>
                        <Button className="hover:bg-primary" size={"icon"} variant={"outline"} onClick={() => onCopy(`${account?.uanNumber}`, "UAN Number")}>
                            <Copy className="top-2.5 h-4 w-4 text-foreground" />
                        </Button>
                    </div>

                </div>
            </div>

        </>
    )
}