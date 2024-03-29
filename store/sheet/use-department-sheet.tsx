import { Department } from "@/types/profile";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface useDepartmentSheetInterface {
  department: Department;
  departmentList?: any;
  isOpen: boolean;
  set: (department: any) => void;
  setList: (departmentList: any) => void;
  reset: () => void;
}
 
export const useDepartmentSheet = create(persist<useDepartmentSheetInterface>((set, get) => ({
  department: {
    id: ""
  },
  isOpen: false,
  departmentList: [],
  set: (department: Department) => set({ department, isOpen: true }),
  setList: (departmentList: any) => set({ departmentList }),
  reset: () => set({ department: { id: ""}, isOpen: false }),
}), { name: 'department_tag' })); 


 