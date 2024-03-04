import { useCallback, useState } from "react"
import { useUpdateRef } from "./useUpdateRef"
import { isFunction } from "lodash-es"
import { useEvent } from "./useEvent"

// const isEqual = Object.is
const isEqual: any = () => false
const nullOnchange = () => {}
// const
/**
 * if `controlledState` is `undefined` will be uncontrolled using the defaultState
 *
 * @param defaultState
 * @param controlledState
 * @param onChange
 */
export function useUncontrolledState<T>(
    defaultState: T | (() => T),
    controlledState?: T,
    onChange: (next: T, ...args: any[]) => void = nullOnchange,
    stateIsEqual = isEqual
) {
    const [internalState, setInternalState] = useState<T>(defaultState)

    const uncontrolled = controlledState === undefined

    const state = uncontrolled ? internalState : (controlledState as T)

    const onChangeLatest = useEvent(onChange)
    const stateIsEqualLatest = useEvent(stateIsEqual)
    const stateLatestRef = useUpdateRef(state)

    const tryChangeState = useCallback(
        (stateOrFunction: React.SetStateAction<T>, ...args: any[]) => {
            const state = stateLatestRef.current
            const nextState = isFunction(stateOrFunction) ? stateOrFunction(state) : stateOrFunction

            if (stateIsEqualLatest(nextState, state)) return

            if (uncontrolled) {
                setInternalState(nextState)
            }
            onChangeLatest(nextState, ...args)
        },
        [uncontrolled, stateLatestRef, onChangeLatest, stateIsEqualLatest]
    )

    return [state, tryChangeState, uncontrolled] as const
}
