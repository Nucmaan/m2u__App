import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from "@react-native-async-storage/async-storage";

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      loginUser: (user) => set({ user }),
      logoutUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage', 
      getStorage: () => AsyncStorage, 
    }
  )
);

export default useUserStore;
