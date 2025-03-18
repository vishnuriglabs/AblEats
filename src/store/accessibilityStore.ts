import { create } from 'zustand';

interface AccessibilityState {
  mode: 'voice' | 'deaf' | 'mute';
  highContrast: boolean;
  textSize: 'normal' | 'large' | 'x-large';
  setMode: (mode: 'voice' | 'deaf' | 'mute') => void;
  toggleHighContrast: () => void;
  setTextSize: (size: 'normal' | 'large' | 'x-large') => void;
}

export const useAccessibilityStore = create<AccessibilityState>((set) => ({
  mode: 'voice',
  highContrast: false,
  textSize: 'normal',
  setMode: (mode) => set({ mode }),
  toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
  setTextSize: (textSize) => set({ textSize }),
}));