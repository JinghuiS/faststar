import type { ConfiguredMiddleware } from "wretch/types"
import { LogService } from "../../../utils/log"

export const logMiddleware = (): ConfiguredMiddleware => {
    return (next) => (url, options) => {
        const logService = new LogService()

        return next(url, options).then((res) => {
            logService.primaryGroup(url)
            console.log(res)
            logService.groupEnd()
            return res
        })
    }
}
