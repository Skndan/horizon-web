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
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns/format";
import { useAuth } from "@/context/auth-provider";
import apiClient from "@/lib/api/api-client";
import toast from "react-hot-toast";


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
  const [date, setDate] = useState({
    from: '',
    to: '',
  });

  const onSubmit = async (data: PayRunFormValues) => {

    setLoading(true)

    data.organisation.id = user?.orgId;
    data.payPeriodStartDate = date.from;
    data.payPeriodEndDate = date.to;

    await apiClient.post(``, {});
    
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
        <h2 className="text-xl tracking-tight">Process Pay Run for <span className="font-bold">February 2024</span></h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Pay Run
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
              <Label className="text-md">Yet to process</Label>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground">No. of Employees</Label>
              <Label className="text-md">Yet to process</Label>
            </div>
          </div>
        </div>
        <div className="col-span-3 text-muted-foreground">
          <div className="flex flex-row items-center">
            <Info className="h-4 w-4 mr-1" />
            <p>There are no employees, with completed profiles in this payroll. Please complete their profile to process this payrun.</p>
          </div>
        </div>
        <div className="row-span-2 justify-center flex flex-col">
          <Button disabled={true}>Create Pay Run</Button>
        </div>
      </div>

    </div>
  </>
}

export default RunPage;