import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/use-user-store";
// import { useUserStore } from "@/store/use-user-store";
import { getSession, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function UserNav() {
  const router = useRouter();
 
  
  const { profile } = useUserStore(); 


  const onLogOut = () => {
    signOut({ redirect: false }).then(() => {
      router.push("/"); // Redirect to the dashboard page after signing out
    });
  };

  const refresh = async () => {
    // console.log(profile);
    // console.log(profile.name)
    // const session = await getSession();
    // console.log(session);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="https://lh3.googleusercontent.com/a/ACg8ocKSpvyPl4EVUh8H6secozxGoEsdWQw8xap03MNTLoD8lQ=s96-c"
              alt="@shadcn"
            />
            <AvatarFallback>BM</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile.username}</p>
            <p className="text-xs leading-none text-muted-foreground pt-2">{profile.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
            <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
          </DropdownMenuItem>  
          <DropdownMenuItem onClick={refresh}>
            Organisation Settings
          </DropdownMenuItem>  
        </DropdownMenuGroup>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={onLogOut}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
