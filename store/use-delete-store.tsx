import { create } from "zustand";
import { persist } from "zustand/middleware"

interface userDeleteInterface {
    flag: string;
    set: (flag: string) => void;
}

export const useDeleteStore = create(persist<userDeleteInterface>((set, get) => ({
    flag: '',
    set: (flag: any) => set({ flag }),
}), { name: 'delete_tag' }))


