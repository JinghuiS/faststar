import React from "react"

import {
    Faststar,
    Resource,
    jsonServerProvider,
    i18nZnTranslation,
    createAuthHttpClient,
    createAuthProvider
} from "faststar"
import { Users } from "./crud/Users"
import { createHttpMiddleware } from "faststar/src/api/http/createHttpMiddleware"
import { useAuthStore } from "faststar/src/store/auth"

const dataProvider = jsonServerProvider(
    "https://jsonplaceholder.typicode.com",
    createAuthHttpClient(createHttpMiddleware([]))
)
const authProvider = {
    ...createAuthProvider(dataProvider.httpClient, {
        loginUrl: "/api/login"
    }),
    ...{
        login: async ({ username, password }) => {
            if (username === "admin" && password === "admin") {
                useAuthStore.setState({ token: "admin" })
                return Promise.resolve()
            }

            return Promise.reject()
        }
    }
}

function App() {
    return (
        <Faststar
            routerType="hash"
            basename="/"
            dataProvider={dataProvider}
            authProvider={authProvider}
            i18n={{
                languages: [
                    {
                        key: "zh",
                        label: "简体中文",
                        translation: i18nZnTranslation
                    }
                ]
            }}
        >
            <Resource {...Users} />
        </Faststar>
    )
}

export default App
