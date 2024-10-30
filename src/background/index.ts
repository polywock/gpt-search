
import "./init"
import "./requests"

import { loadGsm } from "../utils/gsm"
import { ensureMigrated } from "./init"
import { AnyDict } from "../types"


// Prep is for preamble stuff.
async function getPrep() {
    const ph = await getSearchPlaceholder()
    return {ph: ph || null}
}

async function getSearchPlaceholder(): Promise<string> {
    const v = (await chrome.storage.local.get('o:ph'))['o:ph']
    if (v) return v;
    return (await loadGsm()).search
}


chrome.action?.onClicked.addListener(tab => {
    chrome.tabs.create({url: chrome.runtime.getURL('options.html')})
})


chrome.runtime.onMessage.addListener((msg, sender, reply) => {
    if (msg.type === "LOAD_RACCOON") {
        chrome.scripting.executeScript({
            target: {tabId: sender.tab.id, allFrames: false},
            files: ["./raccoon.js"]
        })
        reply(true)
    } else if (msg.type === "REQUEST_GSM") {
        loadGsm().then(gsm => {
            chrome.storage.local.set({'o:ph': gsm.search})
            reply(gsm)
        }, err => reply(null))
        return true 
    } else if (msg.type === "PREP") {
        getPrep().then(prep => {
            reply(prep)
        })
        return true 
    } else if (msg.type === "OPEN_LINK") {
        chrome.tabs.create({url: msg.url, active: msg.active, index: sender.tab.index + 1})
    } else if (msg.type === "RESET") {
        reset().then(() => reply({}), error => reply({error}))
        return true 
    } else if (msg.type === "REQUEST_CREATE_TAB") {
        chrome.tabs.create({
            url: msg.url,
            index: sender.tab.index + 1,
            active: msg.active 
        })
        reply(true)
    } else if (msg.type === "GET_SESSION_ITEM") {
        chrome.storage.session.get(msg.keys as chrome.storage.StorageGet).then(ok => {
            reply({ok})
        }, error => reply({error}))
        return true 
    } else if (msg.type === "SET_SESSION_ITEM") {
        chrome.storage.session.set(msg.items as AnyDict).then(() => {
            reply({})
        }, error => reply({error}))
        return true 
    } 
}) 

async function reset() {
    await chrome.storage.local.clear()
    await chrome.storage.session.clear()
    await ensureMigrated()
}