import { create } from "zustand";
import { persist } from "zustand/middleware"

interface userUpdateInterface {
    flag: string;
    set: (flag: string) => void;
}

export const useUpdateStore = create(persist<userUpdateInterface>((set, get) => ({
    flag: '',
    set: (flag: any) => set({ flag }),
}), { name: 'update_tag' }))


