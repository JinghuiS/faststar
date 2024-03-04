import React, { createContext, useContext, useRef, type PropsWithChildren, useMemo } from "react"
import { createStore, useStore } from "zustand"
import { immer } from "zustand/middleware/immer"
import type { ExtractState, ZustandStore } from "../store/types"
import type { FieldHandler } from "../components"
import { useQuery } from "@tanstack/react-query"

type State = {
    data: { [key: string]: any }
    setDate: (key: string, value: any) => void
}

type StoreType = ZustandStore<State>

const StoreContext = createContext<StoreType>(null!)

export const RequestDataStoreProvider = ({ children }: PropsWithChildren) => {
    const storeRef = useRef<StoreType>()
    if (!storeRef.current) {
        storeRef.current = createStore<State>()(
            immer((set) => ({
                data: {},
                setDate: (key, value) => {
                    set((state) => {
                        state.data[key] = value
                    })
                }
            }))
        )
    }
    return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>
}

export function useRequestDataStore<U>(selector: (state: ExtractState<StoreType>) => U) {
    const store = useContext(StoreContext)
    if (!store) {
        throw new Error("Missing RequestDataStoreProvider")
    }
    return useStore(store, selector)
}

export function useRequestDataStoreApi() {
    const store = useContext(StoreContext)
    if (!store) {
        throw new Error("Missing RequestDataStoreProvider")
    }
    return useStore(store)
}

export function useRequestDataStoreDataQuery(
    fields: FieldHandler[],
    values: Record<string, any>,
    resource: string
) {
    const context = useRequestDataStoreApi()
    const promiseList = useMemo(() => {
        return Promise.all(
            fields
                .map((fieldHandler) => fieldHandler("list"))
                .filter((item) => item.request)
                .map((item) => {
                    if (item.request) {
                        return item.request(values).then((res) => {
                            return {
                                key: item.source,
                                data: res
                            }
                        })
                    } else {
                        return {
                            key: item.source,
                            data: []
                        }
                    }
                })
        )
    }, [fields, values, resource])

    // const

    const { data } = useQuery({
        queryKey: [resource, "requestData", values],
        queryFn: async (v) =>
            promiseList.then((res) => {
                return res.reduce((acc, v) => {
                    if (v.data) {
                        acc[v.key] = v.data
                        context.setDate(v.key, v.data)
                    }
                    return acc
                }, {} as Record<string, any>)
            })
    })

    return data
}

export function connectRequestDataStore<P>(
    Component: React.ComponentType<P>
): React.ComponentType<P> {
    return (props: P) => {
        return (
            <RequestDataStoreProvider>
                <Component {...(props as P & React.JSX.IntrinsicAttributes)} />
            </RequestDataStoreProvider>
        )
    }
}
