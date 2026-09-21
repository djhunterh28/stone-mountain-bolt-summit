import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemePreference } from "@/lib/crm/theme";

type UiState = {
  memberId: number;
  setMemberId: (id: number) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;
  addOpen: boolean;
  addKind: "deal" | "lead" | "person" | "org" | "activity";
  setAddOpen: (v: boolean, kind?: UiState["addKind"]) => void;
  assistantOpen: boolean;
  setAssistantOpen: (v: boolean) => void;
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  dirty: boolean;
  setDirty: (v: boolean) => void;
};

export const useUi = create<UiState>()(
  persist(
    (set) => ({
      memberId: 1,
      setMemberId: (id) => set({ memberId: id }),
      sidebarOpen: false,
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
      commandOpen: false,
      setCommandOpen: (v) => set({ commandOpen: v }),
      addOpen: false,
      addKind: "deal",
      setAddOpen: (v, kind) => set({ addOpen: v, ...(kind ? { addKind: kind } : {}) }),
      assistantOpen: false,
      setAssistantOpen: (v) => set({ assistantOpen: v }),
      theme: "light",
      setTheme: (theme) => set({ theme }),
      dirty: false,
      setDirty: (v) => set({ dirty: v }),
    }),
    { name: "northline-ui", partialize: (s) => ({ memberId: s.memberId, theme: s.theme }) },
  ),
);
