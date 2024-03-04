import { Faststar, Resource, jsonServerProvider, i18nZnTranslation } from "faststar"
import { Test } from "./crud/Test"

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
            <Resource {...Test} />

            {/* <CustomRoute name="user">
                <div>这是测试</div>
            </CustomRoute> */}
        </Faststar>
    )
}

export default App
