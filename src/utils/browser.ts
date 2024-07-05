import { AnyDict } from "../types"

export function openLink(url: string, active = true) {
    chrome.runtime.sendMessage({type: "REQUEST_CREATE_TAB", url, active})
}

export function localGet(keys: chrome.storage.StorageGet) {
    return chrome.storage.local.get(keys)
}

export function localSet(items: AnyDict) {
    return chrome.storage.local.set(items)
}

export function sessionGet(keys: chrome.storage.StorageGet) {
    return chrome.storage.session.get(keys)
}

export function sessionSet(items: AnyDict) {
    return chrome.storage.session.set(items)
}

async function requestSessionGet(keys: chrome.storage.StorageGet) {
    const res = await chrome.runtime.sendMessage({type: 'GET_SESSION_ITEM', keys})
    if (res?.error) throw res.error 
    return res?.ok as AnyDict
}

async function requestSessionSet(items: AnyDict) {
    const res = await chrome.runtime.sendMessage({type: 'SET_SESSION_ITEM', items})
    if (res?.error) throw res.error 
    return res?.ok as void 
}

export const sessionGetFallback = chrome.storage.session?.setAccessLevel ? sessionGet : requestSessionGet
export const sessionSetFallback = chrome.storage.session?.setAccessLevel ? sessionSet : requestSessionSet