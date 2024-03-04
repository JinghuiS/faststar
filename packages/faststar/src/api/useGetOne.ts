import { type UseQueryOptions, useQuery, type UseQueryResult } from "@tanstack/react-query"
import { useDataProvider } from "../context/faststar"
import type { GetOneParams, BasicRecord } from "./types"

export function useGetOne<RecordType extends BasicRecord = any>(
    resource: string,
    { id, meta }: GetOneParams<RecordType>,
    options?: Omit<UseQueryOptions<RecordType, Error>, "queryKey">
): UseGetOneHookValue<RecordType> {
    const dataProvider = useDataProvider()

    return useQuery<RecordType, Error, RecordType>(
        // Sometimes the id comes as a string (e.g. when read from the URL in a Show view).
        // Sometimes the id comes as a number (e.g. when read from a Record in useGetList response).
        // As the react-query cache is type-sensitive, we always stringify the identifier to get a match
        {
            queryKey: [resource, "getOne", { id: String(id), meta }],
            queryFn: () =>
                dataProvider.getOne<RecordType>(resource, { id, meta }).then(({ data }) => data),
            ...options
        }
    )
}

export type UseGetOneHookValue<RecordType extends BasicRecord = any> = UseQueryResult<
    RecordType,
    Error
>
