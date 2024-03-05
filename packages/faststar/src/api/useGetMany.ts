import {
    useQueryClient,
    useQuery,
    type UseQueryOptions,
    type UseQueryResult,
    hashKey
} from "@tanstack/react-query"
import { useDataProvider } from "../context/dataProvider"

import type { BasicRecord, GetManyParams } from "./types"

export const useGetMany = <RecordType extends BasicRecord = any>(
    resource: string,
    params: Partial<GetManyParams> = {},
    options?: UseQueryOptions<RecordType[], Error>
): UseGetManyHookValue<RecordType> => {
    const { ids, meta } = params
    const dataProvider = useDataProvider()
    const queryClient = useQueryClient()
    const queryCache = queryClient.getQueryCache()

    return useQuery<RecordType[], Error, RecordType[]>(
        {
            queryKey: [
                resource,
                "getMany",
                {
                    ids: !ids || ids.length === 0 ? [] : ids.map((id) => String(id)),
                    meta
                }
            ],
            queryFn: () => {
                if (!ids || ids.length === 0) {
                    // no need to call the dataProvider
                    return Promise.resolve([])
                }
                return dataProvider
                    .getMany<RecordType>(resource, { ids, meta })
                    .then(({ data }) => data)
            },
            retry: false,
            placeholderData: () => {
                const records =
                    !ids || ids.length === 0
                        ? []
                        : ids.map((id) => {
                              const queryHash = hashKey([
                                  resource,
                                  "getOne",
                                  { id: String(id), meta }
                              ])
                              return queryCache.get<RecordType>(queryHash)?.state?.data
                          })
                if (records.some((record) => record === undefined)) {
                    return undefined
                } else {
                    return records as RecordType[]
                }
            },
            ...options
        }
        // {
        //     placeholderData: () => {
        //         const records =
        //             !ids || ids.length === 0
        //                 ? []
        //                 : ids.map((id) => {
        //                       const queryHash = hashQueryKey([
        //                           resource,
        //                           "getOne",
        //                           { id: String(id), meta }
        //                       ])
        //                       return queryCache.get<RecordType>(queryHash)?.state?.data
        //                   })
        //         if (records.some((record) => record === undefined)) {
        //             return undefined
        //         } else {
        //             return records as RecordType[]
        //         }
        //     },
        //     onSuccess: (data) => {
        //         // optimistically populate the getOne cache
        //         data.forEach((record) => {
        //             queryClient.setQueryData(
        //                 [resource, "getOne", { id: String(record.id), meta }],
        //                 (oldRecord) => oldRecord ?? record
        //             )
        //         })
        //     },
        //     retry: false,
        //     ...options
        // }
    )
}

export type UseGetManyHookValue<RecordType extends BasicRecord = any> = UseQueryResult<
    RecordType[],
    Error
>
