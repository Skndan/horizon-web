import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "../ui/scroll-area";

export function RecentActivities() {
  return (

    <ScrollArea className="h-96">
      <div className="flex items-center hover:bg-muted hover:cursor-pointer  hover:rounded-lg py-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src="#" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Olivia Martin</p>
          <p className="text-sm text-muted-foreground">
            I`m requesting 40 hours of Vacation for Apr 15, 2024 - Apr 19, 2024
          </p>
        </div>
      </div>
      <div className="flex items-center hover:bg-muted hover:cursor-pointer  hover:rounded-lg py-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src="#" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Olivia Martin</p>
          <p className="text-sm text-muted-foreground">
            I`m requesting 40 hours of Vacation for Apr 15, 2024 - Apr 19, 2024
          </p>
        </div>
      </div>
      <div className="flex items-center hover:bg-muted hover:cursor-pointer  hover:rounded-lg py-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src="#" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Olivia Martin</p>
          <p className="text-sm text-muted-foreground">
            I`m requesting 40 hours of Vacation for Apr 15, 2024 - Apr 19, 2024
          </p>
        </div>
      </div>
      <div className="flex items-center hover:bg-muted hover:cursor-pointer  hover:rounded-lg py-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src="#" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Olivia Martin</p>
          <p className="text-sm text-muted-foreground">
            I`m requesting 40 hours of Vacation for Apr 15, 2024 - Apr 19, 2024
          </p>
        </div>
      </div>

      <div className="flex items-center hover:bg-muted hover:cursor-pointer hover:rounded-lg py-4">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="#" alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Jackson Lee</p>
          <p className="text-sm text-muted-foreground">
            Hours are ready for your approval
          </p>
        </div>
      </div>
      <div className="flex items-center hover:bg-muted hover:cursor-pointer hover:rounded-lg py-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src="#" alt="Avatar" />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
          <p className="text-sm text-muted-foreground">
            I`m requesting an Asset Request change for Amy Granger
          </p>
        </div>
      </div>
      <div className="flex items-center hover:bg-muted hover:cursor-pointer hover:rounded-lg py-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src="#" alt="Avatar" />
          <AvatarFallback>WK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">William Kim</p>
          <p className="text-sm text-muted-foreground">
            I`m requesting a Compensation Change for Karin Petty.
          </p>
        </div>
      </div>
      <div className="flex items-center hover:bg-muted hover:cursor-pointer hover:rounded-lg py-4 ">
        <Avatar className="h-9 w-9">
          <AvatarImage src="#" alt="Avatar" />
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Sofia Davis</p>
          <p className="text-sm text-muted-foreground">
            I`m requesting a Job Informtion Change for Karin Petty
          </p>
        </div>
      </div>
    </ScrollArea>

  );
}
