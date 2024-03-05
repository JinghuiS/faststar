import React, { useMemo } from "react"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { BrowserRouter, HashRouter } from "react-router-dom"
import { FaststarContextProvider } from "../context/faststar"
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query"
import type { FaststarContextProps } from "../context/faststar"
import { defaultQueryClient } from "../api"
import { BuiltinRoutes } from "./BuiltinRoutes"
import "@arco-design/web-react/dist/css/arco.css"
import { DataProviderContextProvider } from "../context/dataProvider"

interface FaststarProps extends FaststarContextProps {
    queryClient?: QueryClient
    children?: React.ReactNode
    title?: string
}

export const Faststar: React.FC<FaststarProps> = (props) => {
    const {
        basename,
        queryClient = defaultQueryClient,
        routerType = "browser",
        dataProvider,
        title
    } = props

    const Router = useMemo(() => (routerType === "browser" ? BrowserRouter : HashRouter), [])

    return (
        <HelmetProvider>
            <Helmet>
                <title>{title || "Faststar"}</title>
            </Helmet>
            <FaststarContextProvider {...props}>
                <DataProviderContextProvider dataProvider={dataProvider}>
                    <QueryClientProvider client={queryClient}>
                        <Router basename={basename}>
                            <BuiltinRoutes>{props.children}</BuiltinRoutes>
                        </Router>
                    </QueryClientProvider>
                </DataProviderContextProvider>
            </FaststarContextProvider>
        </HelmetProvider>
    )
}

Faststar.displayName = "Faststar"
