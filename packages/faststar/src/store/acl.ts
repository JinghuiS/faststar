import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

interface AclStoreState {
    accessControlList: string[]
    setAccessControlList: (accessControlList: string[]) => void
}

export const useAclStoreState = create<AclStoreState>()(
    immer((set) => ({
        accessControlList: [],
        setAccessControlList: (accessControlList: string[]) => {
            set((state) => {
                state.accessControlList = accessControlList
            })
        }
    }))
)
