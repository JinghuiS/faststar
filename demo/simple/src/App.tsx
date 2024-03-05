import React from "react"

import {
    Faststar,
    Resource,
    jsonServerProvider,
    i18nZnTranslation,
    createAuthHttpClient
} from "faststar"
import { Users } from "./crud/Users"
import { createHttpMiddleware } from "faststar/src/api/http/createHttpMiddleware"

const dataProvider = jsonServerProvider(
    "https://jsonplaceholder.typicode.com",
    createAuthHttpClient(createHttpMiddleware([]))
)

function App() {
    return (
        <Faststar
            routerType="hash"
            basename="/"
            dataProvider={dataProvider}
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
