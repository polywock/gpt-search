import { useCallback, useEffect, useRef, useState } from "react";
import { SubscribeStorageKeys } from "../utils/state";
import { LocalState, AnyDict } from "../types";

type Env = {
    client?: SubscribeStorageKeys
}

export function useStorage(keys: string[], wait?: number, maxWait?: number) {
    const [items, _setItems] = useState(null as AnyDict)
    const env = useRef({} as Env).current

    useEffect(() => {
        env.client = new SubscribeStorageKeys(keys, true, _setItems, wait, maxWait)

        return () => {
            env.client?.release()
            delete env.client
        }
    }, [])

    const setItems = useCallback(async (view: AnyDict) => {
        return env.client?.push(view)
    }, [])


    return [items, setItems]
}

export function useKnownKeys(keys: (keyof LocalState)[], wait?: number, maxWait?: number): [Partial<LocalState>, (v: Partial<LocalState>) => void] {
    return useStorage(keys, wait, maxWait) as [Partial<LocalState>, (v: Partial<LocalState>) => void]
}