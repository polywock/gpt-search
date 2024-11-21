
import rawStyle from '../common/searchStyle.css?raw'
import { createElement, timeout } from '../helper'
import preStyle from './style.css?raw'

declare global {
    interface GlobalVar {
        askedForRaccoon: boolean,
        preambleHost: HTMLDivElement,
        preambleProxy: HTMLElement,
        preambleStub: HTMLInputElement,
        auth?: string,
        prep?: {
            ph?: string
        },
        mo?: MutationObserver
        lastNav: HTMLElement
    }
    
    var gvar: GlobalVar
}


function loadScaffold() {
    const proxy = document.createElement('div')
    const host = createElement(`<div style='z-index: 999'></div>`) as HTMLDivElement
    proxy.appendChild(host)
    const shadow = host.attachShadow({mode: 'closed'})

    const style = document.createElement('style')
    style.textContent = `${preStyle}\n${rawStyle}`

    shadow.appendChild(style)

    const searchWrapper = createElement(`<div class='wrapper'></div>`)
    const search = createElement(`<div class='search'></div>`) as HTMLDivElement
    const searchIcon = createElement(`<svg class='searchIcon' stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="pointer-none absolute left-3 top-0 mr-2 h-full text-token-text-tertiary left-6" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`) as SVGElement
    const searchInput = createElement(`<input></input>`) as HTMLInputElement
    searchInput.placeholder = gvar.prep.ph
    search.appendChild(searchIcon)
    search.appendChild(searchInput)
    searchWrapper.appendChild(search)
    shadow.appendChild(searchWrapper)
    
    searchInput.addEventListener('pointerdown', handleStubClick, {capture: true, once: true})
    
    gvar.preambleProxy = proxy
    gvar.preambleStub = searchInput
    gvar.preambleHost = host
}


function insertPageStyle() {
    const s = document.createElement("style")
    s.textContent = `div[role="presentation"]:focus {
        outline: none; 
    }`
    document.documentElement.appendChild(s) 
}

function handleStubClick(e: KeyboardEvent) {
    loadRaccoon()
}
  
function loadRaccoon() {
    if (gvar.askedForRaccoon) return 
    chrome.runtime.sendMessage({type: 'LOAD_RACCOON'})
    gvar.askedForRaccoon = true 
}

function handleMut(muts: MutationRecord[]) {
    if (gvar.lastNav?.isConnected) return 
    for (let mut of muts) {
        for (let added of mut.addedNodes) {
            if (added.nodeType !== Node.ELEMENT_NODE) continue 

            if (checkIfNav(added as Element)) {
                onNewNav(added as HTMLElement)
                return 
            }

            let nav = getNav(added as Element)
            nav && onNewNav(nav)

        }
    }
}

function checkIfNav(elem: Element) {
    if (elem?.tagName === "NAV" && elem.ariaLabel && elem.classList.contains("h-full")) return true 
    if (elem?.tagName === "NAV" && elem.className.includes("_sidebar")) return true 
}

function onNewNav(nav: HTMLElement) {
    gvar.lastNav = nav 
    gvar.preambleProxy ?? loadScaffold()
    nav.insertAdjacentElement('afterbegin', gvar.preambleProxy)
}

function getNav(root?: Element) {
    for (let nav of (root ?? document.body).getElementsByTagName("nav")) {
        if (nav.ariaLabel && nav.classList.contains("h-full")) {
            return nav 
        }
        if (nav.className.includes("_sidebar")) {
            return nav 
        }
    }
}


async function onLoaded() {
    await timeout(500)
    const nav = getNav()
    nav && onNewNav(nav)

    gvar.mo = new MutationObserver(handleMut)
    gvar.mo.observe(document, {subtree: true, childList: true})
}

function main() {
    gvar.prep = {}
    chrome.runtime.sendMessage({type: 'PREP'}).then(v => {
        gvar.prep = v ?? gvar.prep
    }).finally(() => {
        if (document.readyState === "loading")  {
            document.addEventListener("DOMContentLoaded", onLoaded, {capture: true, once: true})
        } else {
            onLoaded() 
        }
    })
    
    insertPageStyle()
}


main()
