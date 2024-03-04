import { parse, stringify } from "qs"
import type { IParseOptions, IStringifyOptions } from "qs"
import { useMemo, useRef } from "react"
import type React from "react"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
// import { useForceUpdate } from "./useForceUpdate"
import { useEvent } from "./useEvent"
import { get, isEmpty, set } from "lodash-es"

export interface UseUrlStateOptions {
    navigateMode?: "push" | "replace"
    /**
     * useful if manager nested data
     */
    nestedKey?: string
    parseOptions?: IParseOptions
    stringifyOptions?: IStringifyOptions
}

const baseParseConfig: IParseOptions = {
    ignoreQueryPrefix: true
}

const baseStringifyConfig: IStringifyOptions = {
    skipNulls: false
}

type UrlState = Record<string, any> | undefined

export const useUrlState = <S extends UrlState = UrlState>(
    initialState?: S | (() => S),
    options?: UseUrlStateOptions
) => {
    type State = Partial<{ [key in keyof S]: any }>
    const { navigateMode = "push", parseOptions, stringifyOptions } = options || {}

    const mergedParseOptions = { ...baseParseConfig, ...parseOptions }
    const mergedStringifyOptions = {
        ...baseStringifyConfig,
        ...stringifyOptions
    }

    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    // const update = useForceUpdate()

    const initialStateRef = useRef(
        typeof initialState === "function" ? (initialState as () => S)() : initialState || {}
    )

    const fullQueryFromUrl = useMemo(
        () => parse(location.search, mergedParseOptions),
        [location.search]
    )

    const queryFromUrl = useMemo(() => {
        if (options?.nestedKey) {
            const queryFormString = searchParams.get(options.nestedKey)
            if (!queryFormString) {
                return {}
            }

            return parse(queryFormString || "{}", mergedParseOptions) as Record<string, unknown>

            // get(fullQueryFromUrl, options.nestedKey, {}) as Record<string, unknown>
        } else {
            return parse(searchParams.toString(), mergedParseOptions)
        }
    }, [fullQueryFromUrl, options?.nestedKey, searchParams])

    const targetQuery: State = useMemo(
        () => ({
            ...initialStateRef.current,
            ...queryFromUrl
        }),
        [queryFromUrl]
    )

    const generateQueryToUrl = useEvent((newQuery: Record<string, unknown>) => {
        if (options?.nestedKey) {
            if (isEmpty(newQuery)) {
                searchParams.delete(options.nestedKey)
                setSearchParams(searchParams)
                return stringify(newQuery, mergedStringifyOptions)
            }

            searchParams.set(options.nestedKey, stringify(newQuery, mergedStringifyOptions))
            setSearchParams(searchParams)
            return stringify(newQuery, mergedStringifyOptions)
        } else {
            Object.entries({ ...queryFromUrl, ...newQuery }).forEach(([key, value]) => {
                // console.log(key, value)

                if (isEmpty(value)) {
                    searchParams.delete(key)
                } else {
                    searchParams.set(key, value as any)
                }
            })

            setSearchParams(searchParams)
            return stringify({ ...queryFromUrl, ...newQuery }, mergedStringifyOptions)
        }
    })

    const setState = (s: React.SetStateAction<State>) => {
        const newQuery = typeof s === "function" ? s(targetQuery) : s

        generateQueryToUrl(newQuery)
    }

    return [targetQuery, useEvent(setState)] as const
}
