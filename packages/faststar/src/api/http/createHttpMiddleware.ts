import wretch, { type ConfiguredMiddleware } from "wretch"
import { type Options, createHeadersFromOptions } from "./request"
import { HttpError } from "./error"

const api = wretch()

export function createHttpMiddleware(httpMiddleware: ConfiguredMiddleware[]) {
    return async (url: string, options: Options = {}) => {
        const requestHeaders = createHeadersFromOptions(options)
        const response = await api
            .options(options)
            .options({ headers: requestHeaders })
            .errorType("json")
            .middlewares(httpMiddleware)
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
}
