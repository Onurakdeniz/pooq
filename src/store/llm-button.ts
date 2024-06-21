import { create } from "zustand";

interface LLMFilterProps {
  open: boolean;
  setOpen: () => void;
}

export const useLLMFilterStore = create<LLMFilterProps>((set) => ({
  open: false,
  setOpen: () => set((state) => ({ open: !state.open })),
}));
