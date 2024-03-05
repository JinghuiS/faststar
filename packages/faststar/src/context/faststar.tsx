// import
import React, { createContext, memo, type FC, type PropsWithChildren, useContext } from "react"
import type { AuthProvider, DataProvider } from "../api/types"
import { defaultDataProvider } from "../api/defaultDataProvider"
import type { TranslationKeys } from "../i18n"
import { useInitI18N } from "../hooks/useInitI18N"

export const DEFAULT_FASTSTAR_CONTEXT: FaststarContextProps = {
    rowKey: "id"
}

export interface FaststarContextProps {
    basename?: string
    routerType?: "browser" | "hash"
    welcome?: React.ReactElement | false
    dataProvider?: DataProvider
    authProvider?: AuthProvider
    i18n?: {
        languages: { key: string; label: string; translation: TranslationKeys }[]
    }
    layout?: React.ReactElement
    loginPage?: React.ReactElement
    header?: React.ReactNode
    footer?: React.ReactNode
    rowKey?: string
}

const FaststarContext = createContext<FaststarContextProps>(DEFAULT_FASTSTAR_CONTEXT)
FaststarContext.displayName = "FaststarContext"

export const FaststarContextProvider: FC<PropsWithChildren<FaststarContextProps>> = memo(
    ({ children, ...props }) => {
        useInitI18N(props.i18n)
        return (
            <FaststarContext.Provider value={{ ...DEFAULT_FASTSTAR_CONTEXT, ...props }}>
                {children}
            </FaststarContext.Provider>
        )
    }
)
FaststarContextProvider.displayName = "FaststarContextProvider"

export function useFaststarContext(): FaststarContextProps {
    return useContext(FaststarContext)
}
