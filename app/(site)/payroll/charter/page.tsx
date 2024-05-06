"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SubHeading } from "@/components/ui/sub-heading";
import { formatDateToMonthYear } from "@/lib/utils/string-utils";
import { usePayrollStore } from "@/store/use-payroll-store";
import { PayrollCharter } from "@/types/payroll";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DateTimeCell from "@/components/common/date-time-cell";
import { ComingSoonPage } from "@/components/common/coming-soon";
import { DataTable } from "./_component/data-table";
import { columns } from "./_component/columns";

const CharterPage = () => {

  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState<PayrollCharter | null>(null)

  const { charter } = usePayrollStore();

  async function fetchData() {
    setLoading(true)

    setLoading(false)
  }

  useEffect(() => {
    fetchData();
  }, [])

  return <>
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <SubHeading title={`Payroll Run for ${formatDateToMonthYear(charter.payrollRun.payPeriodStartDate)}`} />
          <Button onClick={() => {
            // setOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> Submit
          </Button>
        </div>
        <Separator />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-muted">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">
                Payroll cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{`₹${(charter.payrollRun.netPay + charter.payrollRun.totalDeductions).toLocaleString("en-in")}`}</div>
            </CardContent>
            {/* <CardContent>
              <div className="flex flex-row">
                <div className="flex-1 flex-col">
                  <div className="text-2xl font-bold">{`₹${(charter.payrollRun.netPay + charter.payrollRun.totalDeductions).toLocaleString("en-in")}`}</div>
                  <div className="text-md text-muted-foreground">Payroll cost</div>
                </div>
                <div className="flex-1 flex-col">
                  <div className="text-2xl font-bold">{`₹${charter.payrollRun.netPay.toLocaleString("en-in")}`}</div>
                  <div className="text-md text-muted-foreground">Employees Net Pay</div>
                </div>
              </div>
            </CardContent> */}
          </Card>
          <Card className="bg-muted">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">
                Employees Net Pay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{`₹${charter.payrollRun.netPay.toLocaleString("en-in")}`}</div>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">
                Pay Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"><DateTimeCell dateStr={charter.payrollRun.payDate} isTime={0} /></div>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">
                Head count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{charter.payrollRun.headCount}</div>
            </CardContent>
          </Card>
        </div>

        <DataTable columns={columns} data={charter.employeePayrollRuns} />
        {/* <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="tax">Tax & Deductions</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="space-y-4"></TabsContent>
          <TabsContent value="tax" className="space-y-4"><ComingSoonPage /></TabsContent>
          <TabsContent value="insights" className="space-y-4"><ComingSoonPage /></TabsContent>
        </Tabs> */}
      </div>
    </div>
  </>


};

export default CharterPage;