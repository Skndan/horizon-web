import { create } from "zustand";
import { persist } from "zustand/middleware"

import { Workflow } from "@/types/hiring";

interface WorkflowInterface {
    workflow: Workflow[];
    set: (charter: any) => void;
}

export const useWorkflow = create(persist<WorkflowInterface>((set, get) => ({
    workflow: [],
    set: (workflow: Workflow[]) => set({ workflow }),
}), { name: 'workflow_tag' }))

 
