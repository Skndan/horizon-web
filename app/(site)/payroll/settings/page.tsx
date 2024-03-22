import { Separator } from "@/components/ui/separator";
import { SubHeading } from "@/components/ui/sub-heading";
import { PayScheduleForm } from "./components/pay-schedule-form";

export const PaySchedulePage = () => {
    return (
        <>
            <div className="space-y-6 lg:max-w-2xl">
                <SubHeading title="Pay Schedule" description="Organisation Payroll Schedule" />
                <Separator />
                <PayScheduleForm />
            </div>
        </>)
}

export default PaySchedulePage;