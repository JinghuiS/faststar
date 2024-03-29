import React, { useEffect, useState } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
// import { defaultAuthParams, useCheckAuth } from "../api/auth"

import { useConfigureAdminRouterFromChildren } from "../hooks/useConfigureAdminRouterFromChildren"
import { useDelay } from "../hooks/useDelay"
import { useUserStore } from "../store/user"
import type { FaststarChildren } from "../types"
import { createSelector } from "../utils/createSelector"

import { BasicLayout } from "./layout"
import { LoadingView } from "./LoadingView"
import { useFaststarContext } from "../context/faststar"
import { useScrollToTop } from "../hooks/useScrollToTop"
import { useCheckAuth } from "../api/auth/useCheckAuth"
import { LoginPage } from "./login/LoginPage"
import { defaultAuthParams } from "../api/auth/const"
import { WelcomePage } from "./welcome/WelcomePage"

export interface BuiltinRoutesProps {
    children: FaststarChildren
}

export const BuiltinRoutes: React.FC<BuiltinRoutesProps> = React.memo((props) => {
    useScrollToTop()
    const { customRoutesWithLayout, customRoutesWithoutLayout, resources, components } =
        useConfigureAdminRouterFromChildren(props.children)
    const {
        welcome = <WelcomePage />,
        // dashboard = <Dashboard />,
        authProvider,
        layout = <BasicLayout />,
        loginPage = <LoginPage />,
        basename
    } = useFaststarContext()
    const requireAuth = Boolean(authProvider)
    const [canRender, setCanRender] = useState(!requireAuth)
    const oneSecondHasPassed = useDelay(100)
    const { isLogin } = useUserStore(createSelector("isLogin"))

    const checkAuth = useCheckAuth()
    const location = useLocation()

    useEffect(() => {
        if (requireAuth && location.pathname !== defaultAuthParams.loginUrl) {
            checkAuth(location)
                .then(() => {
                    setCanRender(true)
                })
                .catch(() => {
                    setCanRender(false)
                })
        }
    }, [checkAuth, requireAuth, isLogin, location])

    return (
        <>
            <Routes>
                {customRoutesWithoutLayout}

                <Route path={defaultAuthParams.loginUrl} element={loginPage} />

                {canRender ? (
                    <Route element={layout}>
                        <Route
                            path="*"
                            element={
                                <>
                                    <Routes>
                                        {welcome && <Route path="/welcome" element={welcome} />}

                                        {customRoutesWithLayout.map((item) => (
                                            <Route
                                                key={item.element.props.name}
                                                path={`${item.element.props.name}/*`}
                                                element={item.element}
                                            />
                                        ))}

                                        {resources.map((resource) => (
                                            <Route
                                                key={resource.element.props.name}
                                                path={`${resource.element.props.name}/*`}
                                                element={resource.element}
                                            />
                                        ))}

                                        <Route
                                            path="/"
                                            element={
                                                <Navigate
                                                    to={
                                                        welcome
                                                            ? "/welcome"
                                                            : `/${resources[0].element.props.name}/`
                                                    }
                                                />
                                            }
                                        />

                                        <Route path="*" element={<div>404</div>} />
                                    </Routes>
                                </>
                            }
                        />
                    </Route>
                ) : oneSecondHasPassed ? (
                    <Route path="*" element={<LoadingView />} />
                ) : (
                    <Route path="*" element={null} />
                )}
            </Routes>

            {components}
        </>
    )
})
BuiltinRoutes.displayName = "BuiltinRoutes"
