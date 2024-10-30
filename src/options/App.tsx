
import { Toggle } from "./comps/Toggle"
import { LOCALE_MAP } from "../utils/gsm"
import { Option } from "./comps/Option"
import { NumericInput } from "./comps/NumericInput"
import { ColorWell } from "./comps/ColorWell"
import { useKnownKeys } from "../hooks/useStorage"
import { openLink } from "../utils/browser"
import { CONFIG_KEYS } from "../types"
import "./styles.css"
import { isFirefox } from "./utils"

export function App() {
    const [items, setItems] = useKnownKeys(["g:lang", "g:autoClear", "g:context", "g:highlightColorDark", "g:highlightColorLight", "g:highlightBold", "o:lastTheme", "g:sessionOnly", "g:showImage", "g:orderByDate", "g:strictSearch", "g:scrollTop"])
    if (!items) return 

    return <div className="Options">
        <div className="section">
            <div className="title">{gvar.gsm.general}</div>
            {<Option label={gvar.gsm.language}>
                <select value={items["g:lang"]} onChange={async e => {
                    await chrome.storage.local.set({'g:lang': e.target.value})
                    location.reload()
                }}>
                    {Object.entries(LOCALE_MAP).map(([k, v]) => (
                        <option key={k} value={k} title={v.title}>{v.display}</option>
                    ))}
                </select>
            </Option>}
            {<Option label={gvar.gsm.autoClear} tooltip={gvar.gsm.autoClearTooltip}>
                <Toggle value={items["g:autoClear"]} onChange={v => {
                    setItems({"g:autoClear": v})
                }}/>
            </Option>}
            {items['o:lastTheme'] === 'dark' && (
                <Option label={gvar.gsm.highlightColor} tooltip={gvar.gsm.highlightColorTooltip}>
                    <ColorWell isActive={!!items["g:highlightColorDark"]} color={items["g:highlightColorDark"] || "#6dffd8"} onChange={v => {
                        setItems({'g:highlightColorDark': v})
                    }} onReset={() => {
                        chrome.storage.local.remove('g:highlightColorDark')
                    }}/>
                </Option>
            )}
            {items['o:lastTheme'] === 'light' && (
                <Option label={gvar.gsm.highlightColor} tooltip={gvar.gsm.highlightColorTooltip}>
                    <ColorWell isActive={!!items["g:highlightColorLight"]} color={items["g:highlightColorLight"] || "#008de5"} onChange={v => {
                        setItems({'g:highlightColorLight': v})
                    }} onReset={() => {
                        chrome.storage.local.remove('g:highlightColorLight')
                    }}/>
                </Option>
            )}
            {<Option label={gvar.gsm.highlightBold} tooltip={gvar.gsm.highlightBoldTooltip}>
                <Toggle value={items["g:highlightBold"]} onChange={v => {
                    setItems({"g:highlightBold": v})
                }}/>
            </Option>}
            <Option label={gvar.gsm.showImage} tooltip={gvar.gsm.showImageTooltip}>
                <Toggle value={items["g:showImage"]} onChange={v => {
                    setItems({"g:showImage": v})
                }}/>
            </Option>
            <Option label={gvar.gsm.scrollTop} tooltip={gvar.gsm.scrollTopTooltip}>
                <Toggle value={items["g:scrollTop"]} onChange={v => {
                    setItems({"g:scrollTop": v})
                }}/>
            </Option>
        </div>
        <div className="section">
            <div className="title">{gvar.gsm.search}</div>
            <Option label={gvar.gsm.context} tooltip={gvar.gsm.contextTooltip}>
                <NumericInput rounding={0} min={2} max={5} value={items["g:context"] ?? 2} onChange={v => {
                    setItems({'g:context': v})
                }}/>
            </Option>
            {gvar.gsm._morpho || <Option label={gvar.gsm.strictSearch} tooltip={gvar.gsm.strictSearchTooltip}>
                <Toggle value={items["g:strictSearch"]} onChange={v => {
                    setItems({"g:strictSearch": v})
                }}/>
            </Option>}
            <Option label={gvar.gsm.sortDate} tooltip={gvar.gsm.sortDateTooltip}>
                <Toggle value={items["g:orderByDate"]} onChange={v => {
                    setItems({"g:orderByDate": v})
                }}/>
            </Option>
        </div>
        <div className="section">
            <div className="title">{gvar.gsm.data}</div>
            {<Option label={gvar.gsm.sessionOnly} tooltip={gvar.gsm.sessionOnlyTooltip}>
                <Toggle value={items["g:sessionOnly"]} onChange={v => {
                    if (v) {
                        if (confirm(gvar.gsm.areYouSure)) {
                            removeCachedChats()
                            setItems({"g:sessionOnly": v})
                        }
                    } else {
                        setItems({"g:sessionOnly": v})
                    }
                }}/>
            </Option>}
        </div>
        <div className="section">
            <div className="title">{gvar.gsm.otherProjects.header}</div>
            <div className="promo">
                <a href="https://youtu.be/-tlSHOrf4ro">Ask Screenshot for ChatGPT: </a>
                <span dangerouslySetInnerHTML={{__html: gvar.gsm.otherProjects.askScreenshot}}/>
            </div>
            <div className="promo">
                <a href="https://github.com/polywock/globalSpeed">Global Speed: </a>
                <span>{gvar.gsm.otherProjects.globalSpeed}</span>
            </div>
        </div>
        <div className="section hasTitle help">
            <div className="title">{gvar.gsm.help}</div>
            <br />
            <div className="card">{`${gvar.gsm.issuePrompt} `}<a href="https://github.com/polywock/gpt-search">{gvar.gsm.issueDirective}</a></div>
            <br />
            <div className="buttons">
                <button className="RedButton" onClick={async e => {
                    if (confirm(gvar.gsm.areYouSure)) {
                        chrome.runtime.sendMessage({type: 'RESET'}, () => {
                            location.reload()
                        })
                    }
                }}>{gvar.gsm.reset}</button>
                <button className="RedButton" onClick={async e => {
                    if (confirm(gvar.gsm.areYouSure)) {
                        removeAllCache().then(() => {
                            location.reload()
                        })
                    }
                }}>{gvar.gsm.clearCache}</button>
                <div></div>
                <button onClick={async e => {
                    openLink(`https://github.com/polywock/gptSearch/blob/main/advancedSearch.md`)
                }}>{gvar.gsm.advancedSearch}</button>
            </div>
        </div>
    </div>
}


async function removeCachedChats() {
    const items = await chrome.storage.local.get()
    let keysToDelete: string[] = ['o:auth']
    for (let key in items) {
        if (key.startsWith("o:c:")) keysToDelete.push(key)
    }
    chrome.storage.local.remove(keysToDelete)
}

async function removeAllCache() {
    const items = await chrome.storage.local.get(CONFIG_KEYS)
    await Promise.all([
        chrome.storage.local.clear(),
        chrome.storage.session.clear()
    ])
    await chrome.storage.local.set(items)
}