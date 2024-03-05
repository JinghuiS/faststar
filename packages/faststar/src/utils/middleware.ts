import type { ConfiguredMiddleware, FetchLike } from "wretch/types"
// from https://github.com/elbywan/wretch/blob/master/src/middleware.ts
/**
 * @private @internal
 */
export const middlewareHelper =
    (middlewares: ConfiguredMiddleware[]) =>
    (fetchFunction: FetchLike): FetchLike => {
        return middlewares.reduceRight((acc, curr) => curr(acc), fetchFunction) || fetchFunction
    }
