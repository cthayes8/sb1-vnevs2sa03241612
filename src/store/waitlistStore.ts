import { create } from 'zustand';

interface WaitlistStore {
  isOpen: boolean;
  initialEmail: string;
  source: string;
  setOpen: (isOpen: boolean) => void;
  openModal: (source: string, initialEmail?: string) => void;
  closeModal: () => void;
}

export const useWaitlistStore = create<WaitlistStore>((set) => ({
  isOpen: false,
  initialEmail: '',
  source: '',
  setOpen: (isOpen) => set({ isOpen }),
  openModal: (source, initialEmail = '') => set({ isOpen: true, source, initialEmail }),
  closeModal: () => set({ isOpen: false, initialEmail: '', source: '' }),
})); 