import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useUserAuth = create(
  persist(
    (set, get) => ({
      user: null,

      loginUser: (user) => set({ user }),

      logoutUser: () => set({ user: null }),

      updateUser: (updatedUser) => set({ user: updatedUser }),
    }),
    {
      name: "m2u-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserAuth;
