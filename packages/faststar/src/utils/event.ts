import { EventEmitter } from "eventemitter-strict"

export interface FaststarEventMap {
    refreshList: (resource: string) => void
}

export const sharedEvent = new EventEmitter<FaststarEventMap>()
