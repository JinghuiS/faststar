import type { ConfiguredMiddleware } from "wretch/types"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

interface State {
    middleware: ConfiguredMiddleware[]
    initMiddleware: (middleware: ConfiguredMiddleware[]) => void
}

export const useHttpMiddleware = create<State>()(
    immer((set) => ({
        middleware: [],
        initMiddleware: (middleware: ConfiguredMiddleware[]) => {
            set((state) => {
                state.middleware = middleware
            })
        }
    }))
)
