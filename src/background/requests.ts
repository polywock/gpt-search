import { Gizmo, TempState } from "../types"
import { getLocalItem, setLocal } from "../utils/getKnown"

chrome.webRequest.onBeforeSendHeaders.addListener(deets => {
    processGizmoUrl(deets.url)

    const auth = deets.requestHeaders?.find(r => r.name === "Authorization")?.value
    if (!auth) return 
    chrome.storage.session.set({'s:auth': auth})
    getLocalItem('g:sessionOnly').then(sessionOnly => {
        if (!sessionOnly) setLocal({'o:auth': auth}) 
    })
}, {urls: [
    'https://chatgpt.com/backend-api/*'
], types: ['xmlhttprequest']}, ['requestHeaders'])


const gizmoRegex = /gizmos\/g\-([a-zA-Z0-9]+)/
let gizmos: TempState["o:gizmos"]

async function processGizmoUrl(url: string) {
    const gizmoId = gizmoRegex.exec(url)?.[1]
    if (!gizmoId) return 

    const stk = `s:g:${gizmoId}`
    if ((await chrome.storage.session.get(stk))[stk]) return 
    chrome.storage.session.set({[stk]: true})
    const res = await fetch(`https://chatgpt.com/public-api/gizmos/g-${gizmoId}`)
    if (!res.ok) return 
    const json = await res.json()
    const displayName = json?.gizmo?.display?.name 
    if (!displayName) return 
    const imageUrl = json.gizmo.display.profile_picture_url 
    if (!imageUrl) return 

    if (!gizmos) gizmos = await getLocalItem('o:gizmos') ?? {}
    gizmos[gizmoId] = {
        id: gizmoId,
        name: displayName,
        added: Date.now(),
        imageUrl
    }
    
    setLocal({'o:gizmos': gizmos})
}