import { Holiday } from "@/types/holiday";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface useHolidaySheetInterface {
  holiday: Holiday;
  holidayList?: any;
  isOpen: boolean;
  set: (holiday: any) => void;
  setList: (holidayList: any) => void;
  reset: () => void;
}
 
export const useHolidaySheet = create(persist<useHolidaySheetInterface>((set, get) => ({
  holiday: { id: ""},
  isOpen: false,
  holidayList: [],
  set: (holiday: Holiday) => set({ holiday, isOpen: true }),
  setList: (holidayList: any) => set({ holidayList }),
  reset: () => set({ holiday: { id: ""}, isOpen: false }),
}), { name: 'holiday_tag' })); 


 