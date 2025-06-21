import { create } from "zustand";

interface ProductStore {
    refreshToken: number;
    triggerRefresh: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
    refreshToken: 0,
    triggerRefresh: () => set((state) => ({ refreshToken: state.refreshToken + 1 })),
}));
