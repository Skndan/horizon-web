"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { SidebarNavItem } from "@/types";
import { cn } from "@/lib/utils";
import { Icons } from "../ui/icons";

interface SidebarNavProps {
  items: SidebarNavItem[];
}

const SidebarNav = ({ items }: SidebarNavProps) => {
  const path = usePathname(); 

  if (!items?.length) {
    return null;
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/overview" className="flex items-center pl-3 mb-14">
          <Image src="/logo-white.svg" className="hidden dark:block" width={100} height={48} alt="Logo" />
          <Image src="/logo-black.svg"  className="block dark:hidden" width={100} height={48} alt="Logo" />
        </Link>
        <div className="space-y-1">
          {items.map((item, index) => {
            const Icon = Icons[item.icon || "arrowRight"];
            return (
              item.href && (
                <Link key={index} href={item.disabled ? "/" : item.href}>
                  <span
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      path === item.href ? "bg-accent" : "transparent",
                      item.disabled && "cursor-not-allowed opacity-80"
                    )}
                  >
                    <Icon />
                    <p className="pl-4">{item.title}</p>
                  </span>
                </Link>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;

// (
//   <nav className="grid items-start gap-2">
//     {items.map((item, index) => {
//       const Icon = Icons[item.icon || 'arrowRight'];
//       return (
//         item.href && (
//           <Link key={index} href={item.disabled ? '/' : item.href}>
//             <span
//               className={cn(
//                 'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
//                 path === item.href ? 'bg-accent' : 'transparent',
//                 item.disabled && 'cursor-not-allowed opacity-80'
//               )}
//             >
//               <Icon />
//               <p className='pl-4'>{item.title}</p>
//             </span>
//           </Link>
//         )
//       );
//     })}
//   </nav>
// )
