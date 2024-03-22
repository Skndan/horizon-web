"use client";

import { usePathname } from "next/navigation";
 
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image"; 
 
const SidebarNav = () => {
  const pathname = usePathname();
  const routes = [
    {
      href: `/dashboard`,
      label: "Dashboard",
      active: pathname.match(`/dashboard`),
      children: []
    },
    {
      href: `/employee-management`,
      label: "Employee Management",
      active: pathname.match(`/employee-management`),
      children: [
        {
          href: `/employee-management/directory`,
          label: "Directory",
          description:
            "View all your employees at one place",
        },
        {
          href: `/employee-management/onboarding`,
          label: "Onboarding",
          description:
            "Welcome new member to your organization",
        }
      ]
    },
    {
      href: '/payroll-management',
      label: 'Payroll Management',
      active: pathname.match(`/payroll-management`),
      children: []
    },
  ];
  return (
    <>

      <div className="space-y-4 py-4 flex flex-col h-full">
        <div className="px-3 py-2 flex-1">
          <Link href="/dashboard" className="flex items-center pl-3 mb-14">
            <Image src="/logo-white.svg" className="hidden dark:block" width={100} height={48} alt="Logo" />
            <Image src="/logo-black.svg" className="block dark:hidden" width={100} height={48} alt="Logo" />
          </Link>
          {/* <div className="space-y-1">
            {routes.map((item, index) => {
              return (
                item.href && (
                  <Link key={index} href={item.href}>
                    <span
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg hover:text-accent-foreground",

                      )}
                    >
                      <p className="pl-4">{item.label}</p>
                    </span>
                  </Link>
                )
              );
            })}
          </div> */}

          {routes.map((item, index) => {
            return (

              item.children.length != 0 ?
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7">
                      
                      {item.label}
                        <ChevronDownIcon
                          className={cn(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {item.children.map((item) => (
                          <Disclosure.Button
                            key={item.label}
                            as="a"
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3  font-semibold leading-7  "
                          >
                            {item.label}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure> :
                <a
                  href={item.href}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7"
                >
                  {item.label}
                </a>
            );
          })} 

        </div>
      </div>
    </>
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
