import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResponseDataType } from "./lib-responses";

export const useUserStore = create<{
  user?: ResponseDataType["user"];
  setUser: (user?: ResponseDataType["user"]) => void;
}>()(
  persist(
    (set) => ({
      user: {},
      setUser: (user) =>
        set({
          user,
        }),
    }),
    { name: "user-store" },
  ),
);
