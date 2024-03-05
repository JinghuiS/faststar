import { useAuthStore } from "../../store/auth"
import { useHttp } from "../http"
import type { Options } from "../http/request"
import { defaultAuthStorageKey } from "./const"

export function createAuthHttpClient(http = useHttp) {
    const httpClient: typeof useHttp = (url: string, options: Options = {}) => {
        if (!options.headers) {
            options.headers = new Headers({ Accept: "application/json" })
        }
        let _token = useAuthStore.getState().token

        ;(options.headers as Headers).set("Authorization", `Bearer ${_token}`)

        return http(url, options)
    }

    return httpClient
}
