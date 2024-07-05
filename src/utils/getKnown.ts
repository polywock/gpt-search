import { LocalState, SessionState } from "../types";

export async function getLocal(keys: (keyof LocalState)[]) {
    return (await chrome.storage.local.get(keys)) as LocalState 
}

export async function getLocalItem<T extends keyof LocalState>(key: T) {
    return (await chrome.storage.local.get(key))[key] as LocalState[T]
}

export async function setLocal(override: Partial<LocalState>) {
    await chrome.storage.local.set(override)
}


export async function setSessionKnown(override: Partial<SessionState>) {
    await chrome.storage.session.set(override)
}

export async function getSession(keys: (keyof SessionState)[]) {
    return (await chrome.storage.session.get(keys)) as SessionState 
}

export async function getSessionItem<T extends keyof SessionState>(key: T) {
    return (await chrome.storage.session.get(key))[key] as SessionState[T]
}

