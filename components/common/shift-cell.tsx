import { formatTime } from "@/lib/utils/time-utils";
import { Label } from "../ui/label";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";


const ShiftCell = ({ shiftName, shiftWorkDays, shiftStartDate, shiftEndDate }: { shiftName: string, shiftWorkDays: string[], shiftStartDate: string, shiftEndDate: string }) => {
    return <> 
        <HoverCard>
            <HoverCardTrigger asChild>
                <div className="flex flex-col items-start pl-2 gap-2   hover:underline ">
                    <Label>{shiftName}</Label>
                    <div className="flex flex-row items-center gap-1 text-muted-foreground">
                        <Label>
                            {formatTime(shiftStartDate, "hh:mm A")}
                        </Label>
                        -
                        <Label>
                            {formatTime(shiftEndDate, "hh:mm A")}
                        </Label>
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-90"> 
                <ToggleGroup type="multiple" className="justify-start" size={"sm"} variant="outline" value={shiftWorkDays}>
                    <ToggleGroupItem value="SUN">SUN</ToggleGroupItem>
                    <ToggleGroupItem value="MON">MON</ToggleGroupItem>
                    <ToggleGroupItem value="TUE">TUE</ToggleGroupItem>
                    <ToggleGroupItem value="WED">WED</ToggleGroupItem>
                    <ToggleGroupItem value="THU">THU</ToggleGroupItem>
                    <ToggleGroupItem value="FRI">FRI</ToggleGroupItem>
                    <ToggleGroupItem value="SAT">SAT</ToggleGroupItem>
                </ToggleGroup>
            </HoverCardContent>
        </HoverCard>
    </>
};

export default ShiftCell;