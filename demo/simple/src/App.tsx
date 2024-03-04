import React from "react"

import { Faststar, Resource, jsonServerProvider, i18nZnTranslation } from "faststar"
import { Users } from "./crud/Users"

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com")

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

            {/* <CustomRoute name="user">
                <div>这是测试</div>
            </CustomRoute> */}
        </Faststar>
    )
}

export default App
