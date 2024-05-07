"use client"

import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Loader } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, SlashIcon } from "@radix-ui/react-icons"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Department, Address, Profile, Account, Role } from "@/types/profile"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { SubHeading } from "@/components/ui/sub-heading"
import apiClient from "@/lib/api/api-client"
import { Shift } from "@/types/attendance"
import { EmptyStateTable } from "@/components/common/empty-state-table"
import { FileCard } from "../../view/[employeeId]/component/file-view"
import { SalaryFormCard } from "../../view/[employeeId]/component/salary-form"
import { SalaryTemplateItem } from "@/types/payroll"
import { toTitleCase } from "@/lib/utils/string-utils"

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1),
  mobile: z.string().min(1),
  employeeId: z.string().min(1),
  dateOfJoining: z.any().optional(),
  gender: z.string().min(1).optional(),
  dateOfBirth: z.any().optional(),
  organisation: z.any().optional(),
  employeeStatus: z.any().optional(),
  department: z.any().optional(),
  address: z.any().optional(),
  shift: z.any().optional(),
  designation: z.any().optional(),
  reportingManager: z.any().optional(),
  user: z.any()
});


const accountSchema = z.object({
  accountHolderName: z.string().min(1),
  bankName: z.string().min(1),
  accountNumber: z.string().min(1),
  ifscCode: z.string().min(1),
  panNumber: z.any().optional(),
  uanNumber: z.string().min(1).optional(),
  profile: z.any()
});


type EmployeeFormValues = z.infer<typeof formSchema>
type AccountFormValues = z.infer<typeof accountSchema>

interface EmployeeFormProps {
  initialData: Profile | null;
  initialDataAccount: Account | null;
  // designation: Designation[];
  shifts: Shift[];
  department: Department[];
  address: Address[];
  profile: Profile[];
  roles: Role[];
  orgId: any;
  tab: string | null;
  earningType: SalaryTemplateItem[],
  deductionType: SalaryTemplateItem[],
};

const gender = [
  {
    value: "MALE",
    label: "Male",
  },
  {
    value: "FEMALE",
    label: "Female",
  }
]

const employeeStatus = [
  {
    value: "PROBATION",
    label: "Probation",
  },
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "NOTICE",
    label: "Notice",
  },
  {
    value: "RESIGNED",
    label: "Resigned",
  },
  {
    value: "TERMINATED",
    label: "Terminated",
  },
  {
    value: "DECEASED",
    label: "Deceased",
  },
]


export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  initialDataAccount,
  department,
  address,
  shifts,
  profile,
  orgId,
  tab,
  roles,
  earningType,
  deductionType
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initData, setInitialData] = useState(initialData);
  const [data, setData] = useState(initialData ? true : false);

  const title = initialData ? 'Edit employee ✨' : 'Create Employee ✨';
  const description = initialData ? 'Edit a employee.' : 'Add a new employee';
  const toastMessage = initialData ? 'Employee updated.' : 'Employee created.';
  const toastMessage2 = initialDataAccount ? 'Account updated.' : 'Account created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      organisation: {
        id: ''
      }
    },
    mode: "onChange"
  });

  const form2 = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: initialDataAccount || {
      profile: {
        id: ''
      }
    }
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    try {

      data.organisation.id = orgId;

      if (data.department?.id == null) { data.department = null; }
      if (data.address?.id == null) { data.address = null; }
      if (data.designation?.id == null) { data.designation = null; }
      if (data.reportingManager?.id == null) { data.reportingManager = null; }

      setLoading(true);

      if (initialData) {
        await apiClient
          .put(`/profile/${initialData.id}`, data)
          .then((res) => res.data)
          .then((data) => {
            toast.success(toastMessage);
            router.refresh();
            setInitialData(data);
            setData(true);
          });
      } else {
        await apiClient
          .post("/profile", data)
          .then((res) => res.data)
          .then((data) => {
            toast.success(toastMessage);
            router.refresh();
            setInitialData(data);
            setData(true);
          });
      }

    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit2 = async (data: AccountFormValues) => {
    try {

      data.profile.id = initData?.id; 
      setLoading(true);

      if (initialDataAccount) {
        await apiClient
          .put(`/account/${initialDataAccount.id}`, data)
          .then((res) => res.data)
          .then((data) => {
            toast.success(toastMessage2);
            router.refresh();
            initialDataAccount = data;
          });
      } else {
        await apiClient
          .post("/account", data)
          .then((res) => res.data)
          .then((data) => {
            toast.success(toastMessage2);
            router.refresh();
            initialDataAccount = data;
          });
      }
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tabs defaultValue={tab ?? "info"}>
        <div className="md:flex block:flex-col items-center justify-between py-2">
          <Heading title={title} description={description} />
          <TabsList className="mt-2">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="salary">Salary</TabsTrigger>
            <TabsTrigger value="file">Files</TabsTrigger>
          </TabsList>
          <Breadcrumb className="sm:block hidden">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/organisation/employee">Employee</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Form</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <TabsContent value="info" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

              {/* Basic Information */}
              <Separator />
              <SubHeading title={"Basic Information"} />

              <div className="grid md:grid-cols-3 gap-x-8 gap-y-4">

                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID <span className="text-red-600">*</span></FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Employee ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name <span className="text-red-600">*</span></FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Employee name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile <span className="text-red-600">*</span></FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Employee Mobile" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office Email <span className="text-red-600">*</span></FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Employee Office Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} placeholder="Select a gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {gender.map((category) => (
                            <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                      <FormLabel>Date of birth</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button disabled={loading}
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-auto p-0">
                            <Calendar
                              mode="single"
                              captionLayout="dropdown-buttons"
                              selected={field.value}
                              onSelect={field.onChange}
                              fromYear={1970}
                              toYear={new Date().getFullYear()}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormDescription>
                        Date of birth is used to calculate employee`s age.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Work Information */}
              <SubHeading title={"Work Information"} />

              <div className="grid md:grid-cols-3 gap-x-8 gap-y-4">
                <FormField
                  control={form.control}
                  name="shift.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shift</FormLabel>
                      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} placeholder="Select the shift" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {shifts.map((size) => (
                            <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {department.map((category) => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office</FormLabel>
                      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} placeholder="Select the working location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {address.map((size) => (
                            <SelectItem key={size.id} value={size.id}>{size.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reportingManager.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reporting Manager</FormLabel>
                      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} placeholder="Select the Reporting Manager" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {profile.map((size) => (
                            <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfJoining"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                      <FormLabel>Date of joining</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                disabled={loading}
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-auto p-0">
                            <Calendar
                              mode="single"
                              captionLayout="dropdown-buttons"
                              selected={field.value}
                              onSelect={field.onChange}
                              fromYear={1970}
                              toYear={new Date().getFullYear()}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Status</FormLabel>
                      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} placeholder="Select a Employee Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employeeStatus.map((category) => (
                            <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user.roles[0].id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} placeholder="Select a Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((category) => (
                            <SelectItem key={category.id} value={category.id}>{toTitleCase(category.roleName)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
              <Button disabled={loading} className="ml-auto" type="submit">
                {loading &&
                  <Loader className="animate-spin h-5 w-5 mr-3" />}
                {action}
              </Button>
            </form>
          </Form>

        </TabsContent>
        <TabsContent value="account" className="space-y-4">
          {!data ?
            <EmptyStateTable title={"Employee information not found"} description={"Submit the form in the Information Tab before adding Account details"} action={null} onClick={function (): void {
              throw new Error("Function not implemented.")
            }} /> :
            <Form {...form}>
              <form onSubmit={form2.handleSubmit(onSubmit2)} className="space-y-8 w-full">

                {/* Account Information */}
                <Separator />
                <SubHeading title={"Account Information"} />
                <div className="grid md:grid-cols-3 gap-x-8 gap-y-4">

                  <FormField
                    control={form2.control}
                    name="accountHolderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Holder Name <span className="text-red-600">*</span></FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="Account Holder Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form2.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name <span className="text-red-600">*</span></FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="Bank Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form2.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number <span className="text-red-600">*</span></FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="Account Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form2.control}
                    name="ifscCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code <span className="text-red-600">*</span></FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="IFSC Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form2.control}
                    name="panNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN Number <span className="text-red-600">*</span></FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="PAN Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form2.control}
                    name="uanNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UAN Number <span className="text-red-600">*</span></FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="UAN Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button disabled={loading || !form2.formState.isValid} className="ml-auto" type="submit">
                  {loading &&
                    <Loader className="animate-spin h-5 w-5 mr-3" />}
                  {action}
                </Button>
              </form>
            </Form>
          }
        </TabsContent>
        <TabsContent value="file" className="space-y-4">
          {!data ?
            <EmptyStateTable title={"Employee information not found"} description={"Submit the form in the Information Tab before adding Files"} action={null} onClick={function (): void {
              throw new Error("Function not implemented.")
            }} /> :
            <FileCard profile={initData} />
          }
        </TabsContent>
        <TabsContent value="salary" className="space-y-4">
          {!data ?
            <EmptyStateTable title={"Employee information not found"} description={"Submit the form in the Information Tab before adding Files"} action={null} onClick={function (): void {
              throw new Error("Function not implemented.")
            }} /> :
            <SalaryFormCard
              profile={initData}
              earningType={earningType}
              deductionType={deductionType}
            />
          }
        </TabsContent>
      </Tabs>
    </>
  );
};


{ /* <FormField
control={form.control}
name="dateOfJoining"
render={({ field }) => (
  <FormItem className="flex flex-col pt-2">
    <FormLabel>Date of birth</FormLabel>
    <FormControl>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            captionLayout="dropdown-buttons"
            selected={date}
            onSelect={setDate}
            fromYear={1970}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
    </FormControl>
    <FormDescription>
      Date of birth is used to calculate employee`s age.
    </FormDescription>
    <FormMessage />
  </FormItem>
)}
/> */ }