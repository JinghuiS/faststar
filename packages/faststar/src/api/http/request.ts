import wretch from "wretch"

import { HttpError } from "./error"

export interface Options extends RequestInit {
    user?: {
        authenticated?: boolean
        token?: string
    }
}

export function createHeadersFromOptions(options: Options): Headers {
    const requestHeaders = (options.headers ||
        new Headers({
            Accept: "application/json"
        })) as Headers
    // if (
    //     !requestHeaders.has("Content-Type") &&
    //     !(options && (!options.method || options.method === "GET")) &&
    //     !(options && options.body && options.body instanceof FormData)
    // ) {
    //     requestHeaders.set("Content-Type", "application/json")
    // }

    if (options.user && options.user.authenticated && options.user.token) {
        requestHeaders.set("Authorization", options.user.token)
    }

    return requestHeaders
}

const api = wretch().errorType("json")
export async function fetchJSON(url: string, options: Options = {}) {
    const requestHeaders = createHeadersFromOptions(options)
    const response = await api
        .headers(requestHeaders)
        .options(options)
        .errorType("json")
        // .url(url).get()
        .fetch(options.method || "get", url, options.body || null)
        .res()

    const { status, statusText, headers, body } = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: response.body
    }

    let json = await response.json()

    if (status < 200 || status >= 300) {
        return Promise.reject(new HttpError(statusText, status))
    }
    return await Promise.resolve({ status, headers, body, json })
}

export type HTTPClient = typeof fetchJSON
