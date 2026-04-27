import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User { id: string; email: string; name: string; company: string; nodeId: string; }

interface AppState {
  user: User | null; setUser: (u: User | null) => void;
  isAIDrawerOpen: boolean; toggleAIDrawer: () => void;
  isAllocationModalOpen: boolean; setAllocationModalOpen: (v: boolean) => void;
  commandPaletteOpen: boolean; setCommandPaletteOpen: (v: boolean) => void;
  activePeriod: "1W" | "1M" | "ALL"; setActivePeriod: (p: "1W" | "1M" | "ALL") => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null, setUser: (user) => set({ user }),
      isAIDrawerOpen: false, toggleAIDrawer: () => set((s) => ({ isAIDrawerOpen: !s.isAIDrawerOpen })),
      isAllocationModalOpen: false, setAllocationModalOpen: (v) => set({ isAllocationModalOpen: v }),
      commandPaletteOpen: false, setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
      activePeriod: "1M", setActivePeriod: (activePeriod) => set({ activePeriod }),
    }),
    { name: "sortit-store" }
  )
);
