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
import { useAuth } from "@/context/auth-provider";
import { signOut } from "@/lib/utils/sign-out";
import { useUserStore } from "@/store/use-user-store";
// import { useUserStore } from "@/store/use-user-store"; 
import { useRouter } from "next/navigation";

export function UserNav() {
  const router = useRouter();

  const { user } = useAuth();


  // const onLogOut = () => {
  //   // signOut({ redirect: false }).then(() => {
  //   //   router.push("/"); // Redirect to the dashboard page after signing out
  //   // });
  // };

  const refresh = async () => {
;

    // const session = await getSession();
;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src=""
              alt="@skndan"
            /> 
            <AvatarFallback>
              {user?.username
                .split(" ")
                .map((chunk) => chunk[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username}</p>
            <p className="text-xs leading-none text-muted-foreground pt-2">{user?.email}</p>
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
          onClick={() => {
            signOut();
            router.push("/");
          }}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
