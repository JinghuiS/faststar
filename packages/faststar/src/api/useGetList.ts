import {
    type UseQueryOptions,
    useQueryClient,
    useQuery,
    type UseQueryResult
} from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { useFaststarContext } from "../context/faststar"
import { useEvent } from "../hooks/useEvent"
import type { BasicRecord, GetListParams, GetListResult } from "./types"
import { defaultFilter, defaultSort } from "./consts"
import { sharedEvent } from "../utils/event"
import { useDataProvider } from "../context/dataProvider"

/**
 * Call the dataProvider.getList() method and return the resolved result
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { isLoading: true, refetch }
 * - success: { data: [data from store], total: [total from response], isLoading: false, refetch }
 * - error: { error: [error from response], isLoading: false, refetch }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param {string} resource The resource name, e.g. 'posts'
 * @param {Params} params The getList parameters { pagination, sort, filter, meta }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 *
 * @typedef Params
 * @prop params.pagination The request pagination { page, perPage }, e.g. { page: 1, perPage: 10 }
 * @prop params.sort The request sort { field, order }, e.g. { field: 'id', order: 'DESC' }
 * @prop params.filter The request filters, e.g. { title: 'hello, world' }
 * @prop params.meta Optional meta parameters
 *
 * @returns The current request state. Destructure as { data, total, error, isLoading, refetch }.
 *
 * @example
 *
 * import { useGetList } from 'tushan';
 *
 * const LatestNews = () => {
 *     const { data, total, isLoading, error } = useGetList(
 *         'posts',
 *         { pagination: { page: 1, perPage: 10 }, sort: { field: 'published_at', order: 'DESC' } }
 *     );
 *     if (isLoading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <ul>{data.map(item =>
 *         <li key={item.id}>{item.title}</li>
 *     )}</ul>;
 * };
 */
export const useGetList = <RecordType extends BasicRecord = any>(
    resource: string,
    params: Partial<GetListParams> = {},
    options?: UseQueryOptions<GetListResult<RecordType>, Error>
): UseGetListHookValue<RecordType> => {
    const {
        pagination = { page: 1, perPage: 20 },
        sort = defaultSort,
        filter = defaultFilter,
        meta
    } = params
    const dataProvider = useDataProvider()
    const queryClient = useQueryClient()
    const faststarContext = useFaststarContext()

    const result = useQuery<GetListResult<RecordType>, Error, GetListResult<RecordType>>({
        queryKey: [resource, "getList", { pagination, sort, filter, meta }],
        queryFn: (value) => {
            return dataProvider
                .getList<RecordType>(resource, {
                    pagination,
                    sort,
                    filter,
                    meta
                })
                .then(({ data, total, pageInfo }) => ({
                    data,
                    total,
                    pageInfo
                }))
                .then((value) => {
                    const { data } = value
                    // optimistically populate the getOne cache
                    data.forEach((record) => {
                        queryClient.setQueryData(
                            [
                                resource,
                                "getOne",
                                { id: String(record[faststarContext.rowKey ?? "id"]), meta }
                            ],
                            (oldRecord) => oldRecord ?? record
                        )
                    })

                    return value
                })
        }

        // onSuccess: (value) => {
        //     const { data } = value
        //     // optimistically populate the getOne cache
        //     data.forEach((record) => {
        //         queryClient.setQueryData(
        //             [resource, "getOne", { id: String(record.id), meta }],
        //             (oldRecord) => oldRecord ?? record
        //         )
        //     })
        //     // execute call-time onSuccess if provided
        //     if (options?.onSuccess) {
        //         options.onSuccess(value)
        //     }
        // }
    })

    const handleRefresh = useEvent(() => {
        result.refetch()
    })

    useEffect(() => {
        const fn = (_resource: string) => {
            if (_resource === resource) {
                handleRefresh()
            }
        }
        sharedEvent.on("refreshList", fn)

        return () => {
            sharedEvent.off("refreshList", fn)
        }
    }, [resource])

    return useMemo(
        () =>
            result.data
                ? {
                      ...result,
                      data: result.data?.data,
                      total: result.data?.total,
                      pageInfo: result.data?.pageInfo
                  }
                : result,
        [result]
    ) as UseQueryResult<RecordType[], Error> & {
        total?: number
        pageInfo?: {
            hasNextPage?: boolean
            hasPreviousPage?: boolean
        }
    }
}

export type UseGetListHookValue<RecordType extends BasicRecord = any> = UseQueryResult<
    RecordType[],
    Error
> & {
    total?: number
    pageInfo?: {
        hasNextPage?: boolean
        hasPreviousPage?: boolean
    }
}
