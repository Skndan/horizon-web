import { create } from "zustand";
import { persist } from "zustand/middleware"

import { PayrollCharter } from "@/types/payroll";

interface payrollInterface {
    charter: PayrollCharter | any;
    set: (charter: any) => void;
}

export const usePayrollStore = create(persist<payrollInterface>((set, get) => ({
    charter: {},
    set: (charter: PayrollCharter) => set({ charter }),
}), { name: 'charter_tag' }))

 
