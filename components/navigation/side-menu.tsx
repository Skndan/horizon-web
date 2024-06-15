"use client";

import { usePathname } from "next/navigation";

import { Disclosure } from '@headlessui/react'
import { BackpackIcon, BarChartIcon, CalendarIcon, CardStackIcon, ChevronDownIcon, DashboardIcon, HomeIcon, PaperPlaneIcon, ReaderIcon, RocketIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth-provider";

const SidebarNav = () => {
  const pathname = usePathname();

  const { roles } = useAuth();

  const routes = [
    {
      href: `/dashboard`,
      label: "Dashboard",
      icon: DashboardIcon,
      active: pathname.match(`/dashboard`),
      role: ["hr", "admin", "user"],
      children: []
    },
    {
      href: `/my-space`,
      label: "My Space",
      icon: RocketIcon,
      active: pathname.match(`/my-space`),
      role: ["hr", "admin", "user"],
      children: []
    },
    // {
    //   href: `/leave-tracker`,
    //   label: "Leave Tracker",
    //   icon: ReaderIcon,
    //   active: pathname.match(`/leave-tracker`),
    //   role: ["admin", "hr"],
    //   children: []
    // },
    {
      href: `/organisation`,
      label: "Organisation",
      icon: HomeIcon,
      active: pathname.match(`/organisation`),
      role: ["admin", "hr"],
      children: [{
        href: `/organisation/employee`,
        label: "Employee",
        description:
          "View all your employees at one place",
      },
      {
        href: `/organisation/department`,
        label: "Department",
        description:
          "Define departments in your organisation",
      },
      {
        href: `/organisation/location`,
        label: "Locations",
        description:
          "Manage locations for your organisation",
      },
      {
        href: `/organisation/settings`,
        label: "Settings",
        description:
          "Manage organisation settings",
      }
      ]
    },
    {
      href: `/attendance`,
      label: "Attendance",
      icon: CalendarIcon,
      active: pathname.match(`/attendance`),
      role: ["admin", "hr"],
      children: [
        {
          href: `/leave-tracker`,
          label: "Leave tracker",
          description:
            "Track Employee Leaves",
        },
        {
          href: `/attendance/timesheet`,
          label: "Timesheet",
          description:
            "Employee Timesheets",
        },
        {
          href: `/attendance/tracking`,
          label: "Tracking",
          description:
            "Track employee attendance",
        },
        {
          href: `/attendance/shifts`,
          label: "Shifts",
          description:
            "Manage employee shifts",
        },
        {
          href: `/attendance/adjustment`,
          label: "Adjustment",
          description:
            "Manage login time adjustments",
        }
      ]
    },
    {
      href: `/tasks`,
      label: "Tasks",
      icon: CardStackIcon,
      active: pathname.match(`/tasks`),
      role: ["admin"],
      children: []
    },
    {
      href: '/payroll',
      label: 'Payroll',
      icon: PaperPlaneIcon,
      active: pathname.match(`/payroll`),
      role: ["admin", "hr"],
      children: [
        {
          href: `/payroll`,
          label: "Payroll Runs",
          description:
            "Manage payroll runs",
        },
        {
          href: `/payroll/settings`,
          label: "Settings",
          description:
            "Manage payroll settings",
        }
      ]
    }, 
    {
      href: `/reports`,
      label: "Reports",
      icon: BarChartIcon,
      active: pathname.match(`/reports`),
      role: ["admin"],
      children: []
    }
  ];

  return (
    <>

      <div className="space-y-4 py-4 flex flex-col h-full">
        <div className="px-3 py-2 flex-1">
          <Link href="/dashboard" className="flex items-center pl-3 mb-14">
            <Image src="/horizon-light.svg" className="hidden dark:block" width={180} height={56} alt="Logo" />
            <Image src="/horizon-dark.svg" className="block dark:hidden" width={180} height={56} alt="Logo" />
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
              item.role.includes(roles[0]) &&
                item.children.length != 0 ?
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7">
                        <div className="flex flex-row items-center gap-2">
                          <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {item.label}
                        </div>
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
                item.role.includes(roles[0]) &&
                <a
                  href={item.href}
                  className="-mx-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 flex flex-row items-center"
                >
                  <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
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
