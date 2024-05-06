import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Info, Loader, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns/format";
import { useAuth } from "@/context/auth-provider";
import apiClient from "@/lib/api/api-client";
import toast from "react-hot-toast";
import Link from "next/link";
import { PayrollRun } from "@/types/payroll";
import DateTimeCell from "@/components/common/date-time-cell";
import { formatDateToMonthYear } from "@/lib/utils/string-utils";
import { usePayrollStore } from "@/store/use-payroll-store";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  organisation: z.any().optional(),
  payPeriodStartDate: z.any(),
  payPeriodEndDate: z.any(),
  date: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }, { required_error: "Timeline is required." }).refine((date) => {
    return !!date.from;
  }, "Timeline is required."),
});

type PayRunFormValues = z.infer<typeof formSchema>

const RunPage = () => {

  const { user } = useAuth();
  const router = useRouter();
  const form = useForm<PayRunFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organisation: { id: '' },
      date: {
        from: undefined,
        to: undefined,
      },
    },
    mode: "onChange"
  });

  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(true)
  const [isOpen, setOpen] = useState(false);
  const [data, setData] = useState<PayrollRun | null>(null)
  const { set } = usePayrollStore();
  const [date, setDate] = useState({
    from: '',
    to: '',
  });

  const onSubmit = async (data: PayRunFormValues) => {

    setLoading(true)

    data.organisation.id = user?.orgId;
    data.payPeriodStartDate = date.from;
    data.payPeriodEndDate = date.to;

    await apiClient.post(`/payroll-run`, data).then((res) => res.data)
      .then((data) => {
        set(data);
        router.push(`/payroll/charter`);
      }).catch((err) => {
        setLoading(false)

      });
    setLoading(false)
  };

  const onChange = async (e: any) => {
    if (e) {
      if (e.from && e.to) {

        setDate({ from: formatDate(e.from.toISOString(), "yyyy-MM-dd"), to: formatDate(e.to.toISOString(), "yyyy-MM-dd") });

        await apiClient
          .get(`/payroll-run/fetch/${user?.orgId}/${formatDate(e.from.toISOString(), "yyyy-MM-dd")}/${formatDate(e.to.toISOString(), "yyyy-MM-dd")}`)
          .then((res) => {
            toast.success("You can create payroll run between this timeline");
            setFormLoading(false);
          }).catch(error => {
            if (error.response) {
              if (error.response.status === 400) {
                toast.error("You already have payroll created for this time frame");
                setFormLoading(true);
              } else {
                console.log('Error:', error.message);
              }
            } else {
              console.log('Error:', error.message);
            }
          })
      }
    }
  }

  async function fetchData() {
    setLoading(true)
    await apiClient.get(`/payroll-run/run/${user?.orgId}`).then((res) => res.data)
      .then((data) => {
        setData(data)
        setLoading(false)
      });
    setLoading(false)
  }

  useEffect(() => {
    fetchData();
  }, [])

  return <>
    <Modal title={"Create custom pay run"} description={""} isOpen={isOpen} onClose={() => setOpen(false)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem className="flex flex-col">
                {/* <FormLabel>Date Range</FormLabel> */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value.from && "text-muted-foreground"
                      )}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, "LLL dd, y")} -{" "}
                            {format(field.value.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(field.value.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value.from}
                      selected={{ from: field.value.from!, to: field.value.to }}
                      toDate={new Date()}
                      onSelect={(e) => {
                        field.onChange(e);
                        onChange(e);
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The date range, you want to create payroll run.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={formLoading || loading} className="ml-auto" type="submit">
            {loading &&
              <Loader className="animate-spin h-5 w-5 mr-3" />}
            Create
          </Button>
        </form>
      </Form>
    </Modal>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl tracking-tight">Process Pay Run for <span className="font-bold">{formatDateToMonthYear(data?.payPeriodStartDate)}</span></h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Custom Pay Run
        </Button>
      </div>
      <div className="grid md:grid-cols-4 md:grid-flow-col gap-4 rounded-lg border p-4">
        <div className="col-span-3">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground">{`Employee's Net pay`}</Label>
              <Label className="text-md">Yet to process</Label>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground">Payment Date</Label>
              <DateTimeCell dateStr={data?.payDate} isTime={0} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground">No. of Employees</Label>
              <Label className="text-md">{data?.headCount}</Label>
            </div>
          </div>
        </div>
        {/* <div className="col-span-3 text-muted-foreground">
          <div className="flex flex-row items-center">
            <Info className="h-4 w-4 mr-1" />
            <p>There are no employees, with completed profiles in this payroll. Please complete their profile to process this payrun.</p>
          </div>
        </div> */}
        <div className="row-span-2 justify-center flex flex-col">
          {/* <Button disabled={true}>View Details</Button> */}
          <Link href={`/payroll/`}>
            <Button>View Details</Button>
          </Link>
        </div>
      </div>

    </div>
  </>
}

export default RunPage;