import { create } from "zustand";

interface StepInterface {
  step: number;
  addStep: () => void;
  decrStep: () => void;
  reset: () => void;
}

export const useStepStore = create<StepInterface>((set) => ({
  step: 1,
  addStep: () => set((state) => ({ step: state.step + 1 })),
  decrStep: () => set((state) => ({ step: state.step - 1 })),
  reset: () => set({ step: 1 }),
}));
