"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SubHeading } from "@/components/ui/sub-heading";
import { formatDateToMonthYear } from "@/lib/utils/string-utils";
import { usePayrollStore } from "@/store/use-payroll-store";
import { PayrollCharter } from "@/types/payroll";
import { MoveHorizontal, Plus } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import WarningPage from "./_component/warning";

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

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
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
                Pay Period
              </CardTitle>
            </CardHeader>
            <CardContent> 
              <div className="flex flex-row items-center gap-1">
                <div className="text-lg font-bold"><DateTimeCell dateStr={charter.payrollRun.payPeriodStartDate} isTime={0} /></div>
                <MoveHorizontal className="h-4 w-4" /> 
                <div className="text-lg font-bold"><DateTimeCell dateStr={charter.payrollRun.payPeriodEndDate} isTime={0} /></div>
              </div>
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
        </div >

        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="warning">Warnings
              <span className="ml-2 rounded-md bg-red-400 px-1.5 py-0.5 text-xs leading-none   no-underline group-hover:no-underline text-white">{charter.missedTimesheets.length + charter.salaryLessProfile.length}</span></TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="space-y-4">
            <DataTable columns={columns} data={charter.employeePayrollRuns} />
          </TabsContent>
          <TabsContent value="warning" className="space-y-4"><WarningPage missedTimeSheets={charter.missedTimesheets} salaryLessProfile={charter.salaryLessProfile}/></TabsContent>
          <TabsContent value="insights" className="space-y-4"><ComingSoonPage /></TabsContent>
        </Tabs>
      </div >
    </div >
  </>


};

export default CharterPage;