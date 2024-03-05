import React, { FC, memo, useMemo } from "react"
import { PropsWithChildren, createContext, useContext } from "react"
import { type DataProvider, defaultDataProvider } from "../api"

const DataProviderContext = createContext<DataProvider>(defaultDataProvider)

export const DataProviderContextProvider: FC<PropsWithChildren<{ dataProvider?: DataProvider }>> =
    memo(({ children, dataProvider }) => {
        const finalDataProvider = useMemo(() => {
            if (!dataProvider) {
                return defaultDataProvider
            }
            return dataProvider
        }, [dataProvider])

        return (
            <DataProviderContext.Provider value={finalDataProvider}>
                {children}
            </DataProviderContext.Provider>
        )
    })

DataProviderContext.displayName = "DataProviderContext"

export function useDataProvider() {
    return useContext(DataProviderContext)
}

export default DataProviderContext
