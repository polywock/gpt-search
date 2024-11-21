import { createRoot } from "react-dom/client"
import rawStyle from './style.css?raw'
import rawSearchStyle from '../common/searchStyle.css?raw'
import { App } from './App'
import { requestGsm } from "../utils/gsm"
import { CONFIG_KEYS, Config } from "../types"
import { timeout } from "../helper"
import { localGet, localSet, sessionGetFallback, sessionSetFallback } from "../utils/browser"

declare global {
    interface GlobalVar {
        raccoonHost: HTMLDivElement,
        raccoonSearch?: HTMLInputElement,
        config?: Config,
        getItems?: typeof localGet,
        setItems?: typeof localSet,
        scrollSetCbs?: Set<() => void>
    }
}
gvar.scrollSetCbs = gvar.scrollSetCbs || new Set()

async function main() {
    const b = gvar.preambleStub?.getBoundingClientRect()
    if (b.left == null || b.top == null) return 
    
    const [config, auth] = await Promise.all([
        chrome.storage.local.get(CONFIG_KEYS) as Promise<Config>,
        getAuth()
    ])
    if (auth) gvar.auth = auth
    if (!gvar.auth) {
        await timeout(1000)
        gvar.auth = await chrome.runtime.sendMessage({type: 'GET_AUTH'}) 
    }
    if (!gvar.auth) console.error('No auth found')

    if (config["g:sessionOnly"]) {
        gvar.getItems = sessionGetFallback
        gvar.setItems = sessionSetFallback
    } else {
        gvar.getItems = localGet
        gvar.setItems = localSet
    }

    gvar.config = config 

    gvar.raccoonHost = document.createElement('div')
    
    const shadow = gvar.raccoonHost.attachShadow({mode: 'open'})
    const rootBase = document.createElement('div')
    const style = document.createElement('style')
    style.textContent = rawSearchStyle.concat(rawStyle)

    shadow.appendChild(rootBase)
    shadow.appendChild(style)

    document.documentElement.appendChild(gvar.raccoonHost)

    const root = createRoot(rootBase)
    chrome.storage.local.set({'o:lastTheme': document.documentElement.classList.contains('dark') ? 'dark' : 'light'})

    const dark = document.documentElement.classList.contains('dark')

    root.render(<App config={config} dark={dark} top={b.top} left={b.left} isNewDesign={gvar.lastNav.className.includes("_sidebar")}/>)
}


requestGsm().then(gsm => {
    gvar.gsm = gsm 
    if (gvar.gsm) main()
})


window.addEventListener('rusrusar', (e: CustomEvent) => {
    const deets = JSON.parse(e.detail)
    if (deets.type === 'NO_PUSH') {
        chrome.runtime.sendMessage({type: "OPEN_LINK", url: `${location.origin}/${deets.path}`, active: false})
    } else if (deets.type === "SCROLL_SET") {
        gvar.scrollSetCbs?.forEach(cb => cb())
    }
    e.stopImmediatePropagation()
}, {capture: true})

async function getAuth() {
    let auth = (await sessionGetFallback(['s:auth']))['s:auth']
    if (auth) return auth 
    auth = (await chrome.storage.local.get('o:auth'))['o:auth']
    if (auth) return auth 
}

