import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { DataTable } from "@/components/ui/data-table";
import { MissedTimesheet } from "@/types/payroll";
import { Profile } from "@/types/profile";
import { timesheetColumns } from "./timesheet-column";
import { salaryLessColumns } from "./salaryless-column";

interface EmployeeFormProps {
  missedTimeSheets: MissedTimesheet[];
  salaryLessProfile: Profile[];
}
export const WarningPage: React.FC<EmployeeFormProps> = ({
  missedTimeSheets,
  salaryLessProfile,
}) => {
  return (
    <>
      <Accordion type="multiple" className="w-full rounded-md border px-6"> 
        <AccordionItem key={`salaryLessProfile`} value={`salaryLessProfile`}>
          <AccordionTrigger className="text-xl font-semibold">Salary-less Profiles {`(${salaryLessProfile.length})`}</AccordionTrigger>
          <AccordionContent>
            <DataTable searchKey="name" columns={salaryLessColumns} data={salaryLessProfile} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem key={`missedTimeSheets`} value={`missedTimeSheets`}>
          <AccordionTrigger className="text-xl font-semibold">Missed Timesheets {`(${missedTimeSheets.length})`}</AccordionTrigger>
          <AccordionContent>
            <DataTable searchKey="name" columns={timesheetColumns} data={missedTimeSheets} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </>)
}

export default WarningPage; 