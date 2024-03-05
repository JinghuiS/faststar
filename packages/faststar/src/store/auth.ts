import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { persist, createJSONStorage } from "zustand/middleware"
interface AuthStoreState {
    // isAuthenticated: boolean
    token: string
    setToken: (token: string) => void
    clearToken: () => void
}

export const useAuthStore = create<AuthStoreState>()(
    persist(
        immer((set, get) => ({
            token: "",
            setToken: (token: string) => {
                set({ token })
            },
            clearToken: () => {
                set({ token: "" })
            }
        })),
        {
            name: "faststar-auth",
            storage: createJSONStorage(() => localStorage),
            partialize: (v) => ({ token: v.token })
        }
    )
)
