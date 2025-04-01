import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CardDetails {
  cardNumber: string;
  nameOnCard: string;
  expiry: string;
  cvv: string;
}

type PaymentMethod = 'card' | 'upi' | 'cash';

interface ProfileState {
  name: string;
  email: string;
  phone: string;
  city: string;
  pinCode: string;
  addresses: string[];
  activeAddressIndex: number;
  cardDetails: CardDetails;
  upiId: string;
  preferredPayment: PaymentMethod;
  updateProfile: (data: { 
    name?: string; 
    email?: string; 
    phone?: string;
    city?: string;
    pinCode?: string;
  }) => void;
  updateCardDetails: (details: CardDetails) => void;
  updateUpiDetails: (upiId: string) => void;
  setPreferredPayment: (method: PaymentMethod) => void;
  addAddress: (address: string) => void;
  updateAddress: (index: number, address: string) => void;
  setActiveAddress: (index: number) => void;
  getActiveAddress: () => string | undefined;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      name: 'Guest User',
      email: 'guest@example.com',
      phone: '+91 9876543210',
      city: '',
      pinCode: '',
      addresses: ['123 Main St, City'],
      activeAddressIndex: 0,
      cardDetails: {
        cardNumber: '',
        nameOnCard: '',
        expiry: '',
        cvv: ''
      },
      upiId: '',
      preferredPayment: 'cash',

      updateProfile: (data) => set((state) => ({
        ...state,
        ...data
      })),

      updateCardDetails: (details) => set((state) => ({
        ...state,
        cardDetails: details
      })),

      updateUpiDetails: (upiId) => set((state) => ({
        ...state,
        upiId
      })),

      setPreferredPayment: (method) => set((state) => ({
        ...state,
        preferredPayment: method
      })),

      addAddress: (address) => set((state) => ({
        addresses: [...state.addresses, address]
      })),

      updateAddress: (index, address) => set((state) => ({
        addresses: state.addresses.map((addr, i) => 
          i === index ? address : addr
        )
      })),

      setActiveAddress: (index) => set({ activeAddressIndex: index }),

      getActiveAddress: () => {
        const state = get();
        return state.addresses[state.activeAddressIndex];
      }
    }),
    {
      name: 'profile-storage'
    }
  )
); 