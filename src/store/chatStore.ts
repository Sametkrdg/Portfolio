import { create } from "zustand";

interface ChatStore {
  isOpen: boolean;
  toggle: () => void;
  open:   () => void;
  close:  () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open:   () => set({ isOpen: true }),
  close:  () => set({ isOpen: false }),
}));
