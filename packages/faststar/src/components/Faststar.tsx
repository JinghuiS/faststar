import React, { useMemo } from "react"
import { BrowserRouter, HashRouter } from "react-router-dom"
import { FaststarContextProvider } from "../context/faststar"
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query"
import type { FaststarContextProps } from "../context/faststar"
import { defaultQueryClient } from "../api"
import { BuiltinRoutes } from "./BuiltinRoutes"
import "@arco-design/web-react/dist/css/arco.css"

interface FaststarProps extends FaststarContextProps {
    queryClient?: QueryClient
    children?: React.ReactNode
}

export const Faststar: React.FC<FaststarProps> = (props) => {
    const { basename, queryClient = defaultQueryClient, routerType = "browser" } = props

    const Router = useMemo(() => (routerType === "browser" ? BrowserRouter : HashRouter), [])

    return (
        <FaststarContextProvider {...props}>
            <QueryClientProvider client={queryClient}>
                <Router basename={basename}>
                    <BuiltinRoutes>{props.children}</BuiltinRoutes>
                </Router>
            </QueryClientProvider>
        </FaststarContextProvider>
    )
}

Faststar.displayName = "Faststar"
