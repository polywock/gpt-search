import debounce from "lodash.debounce"

export function _requestTemplateSync() {
    chrome.runtime.sendMessage({type: 'SYNC_TEMPLATES'})
}

export const requestTemplateSync = debounce(_requestTemplateSync, 1000, {leading: true})

let isFirefoxResult: boolean
export function isFirefox() {
  isFirefoxResult = isFirefoxResult ?? navigator.userAgent.includes("Firefox/")
  return isFirefoxResult
}
