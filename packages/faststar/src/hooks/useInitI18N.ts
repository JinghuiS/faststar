import { useRef } from "react"

import { initI18N } from "../i18n"
import type { FaststarContextProps } from "../context/faststar"

export function useInitI18N(i18n?: FaststarContextProps["i18n"]) {
    const initRef = useRef(false)

    if (!initRef.current) {
        if (i18n) {
            const resources = i18n.languages.reduce((prev, curr) => {
                return {
                    ...prev,
                    [curr.key]: { translation: curr.translation }
                }
            }, {})

            initI18N(resources)
        } else {
            initI18N()
        }

        initRef.current = true
    }
}
