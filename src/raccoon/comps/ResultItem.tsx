
import { memo, useRef, useState } from "react"
import { Result } from "../types"
import { softLink } from "../utils/misc"
import { timeout } from "../../helper"
import { CleverDiv } from "./CleverDiv"
import { openLink } from "../../utils/browser"

const _ResultItem = (props: { result: Result}) => {
    const [max, setMax] = useState(4)
    const env = useRef({lastWasChild: false}).current
    const r = props.result
    const titleResult = r.headerResult

    const open = (messageId?: string, mode?: "fg" | "bg") => {
        let url = `/c/${r.id}`
        if (r.isGpt) {
            url = `/g/g-${r.id}`
        }
        if (mode) {
            openLink(`https://chatgpt.com${url}`, mode === "fg")
        } else {
            if (location.pathname !== url) softLink(url)
            clearTimeoutInfo()

            let scrollTo: {id: String, isCurrent?: boolean}

            if (messageId) {
                scrollTo = {id: messageId}
            } else if (env.lastWasChild && r.currentNodeId) {
                scrollTo = {id: r.currentNodeId, isCurrent: true}
            }
            env.lastWasChild = !!messageId

            if (scrollTo) tryScrollIntoView(`div[data-message-id="${scrollTo.id}"]`, scrollTo.isCurrent) 
        }

    }

    const handleTitleClick = (e: React.PointerEvent | React.KeyboardEvent) => {
        open(null)
    }

    const handleMessageClick = (messageId: string, e: React.PointerEvent | React.KeyboardEvent) => {
        open(messageId)
    }

    const handleItemPointerUp= (e: React.PointerEvent) => {
        if (e.button !== 1) return 
        open(null, e.shiftKey ? "fg" : "bg")
    }

    let metaChunks: JSX.Element[] = []
    if (!r.isGpt && r.gizmoName) {
        r.gizmoImg && metaChunks.push(<img key="gizmoImg" src={r.gizmoImg} width="15px" height="15px"/>)
        metaChunks.push(<span key="gizmoName">{r.gizmoName}</span>)
    }
    if (r.elapsed) metaChunks.unshift(<span key="elapsed">{`${r.elapsed}${metaChunks.length === 1 ? ' · ' : ''}`}</span>)

    return <div className="ResultItem">
        <CleverDiv className="header" onCleverClick={handleTitleClick} onPointerUp={handleItemPointerUp} tabIndex={0}>
            <div className="title">
                {r.isGpt && r.gizmoImg && (
                    <img src={r.gizmoImg} width="20px" height="20px"/>
                )}
                <span className="normal">{titleResult ? titleResult.prefix : r.title}</span>
                {titleResult && <>
                    <span className="needle">{titleResult.needle}</span>
                    <span className="normal">{titleResult.suffix}</span>
                </>}
            </div>
            {!!metaChunks.length && (
                <div className="meta">{metaChunks.map(c => c)}</div>
            )}
        </CleverDiv>
        {!!r.parts.length && (
            <div className="conti">
                <>
                    {r.parts.slice(0, max).map(part => (
                        <CleverDiv tabIndex={0} onPointerUp={handleItemPointerUp} onCleverClick={handleMessageClick.bind(this, part.messageId)} key={part.messageId} className="context">
                            <span className="normal">{part.prefix}</span>
                            <span className="needle">{part.needle}</span>
                            <span className="normal">{part.suffix}</span>
                        </CleverDiv>
                    ))}
                </>
                {r.parts.length > max && (
                    <CleverDiv tabIndex={0} className="context" onCleverClick={() => {
                        setMax(max + 10)
                    }}>{`${gvar.gsm.showMore} (${Math.min(r.parts.length - max, 10)})`}</CleverDiv>
                )} 
            </div>
        )}
    </div>
}

export const ResultItem = memo(_ResultItem)

let latestSymbol: Symbol 

let SUPPORTS_SCROLL_INTO_VIEW = "scrollIntoViewIfNeeded" in Element.prototype

async function tryScrollIntoView(target: string, subtle?: boolean, n = 40, delay = 250) {
    const mySymbol = Symbol()
    latestSymbol = mySymbol 
    await timeout(50)
    for (let i = 0; i < n; i++) {
        i > 0 && await timeout(delay)
        if (latestSymbol !== mySymbol) return 
        const elem = document.querySelector(target)
        if (elem) {
            if (subtle) {
                ;(elem as any).scrollIntoView()
            } else {
                activateFor(elem)
                SUPPORTS_SCROLL_INTO_VIEW ? (elem as any).scrollIntoViewIfNeeded() : (elem as any).scrollIntoView()
            }
            return 
        }
    }
}


let timeoutInfo: {
    target: Element,
    timeoutId: number 
}

function clearTimeoutInfo() {
    if (timeoutInfo) {
        clearTimeout(timeoutInfo.timeoutId)
        timeoutInfo.target.removeAttribute("bornagain")
        timeoutInfo = null 
    }
}

function activateFor(target: Element) {
    ensureStyleElement()
    clearTimeoutInfo()
    
    target.setAttribute("bornagain", "")
    timeoutInfo = {
        target,
        timeoutId: window.setTimeout(clearTimeoutInfo, 2500)
    }
}


let focusStyle: HTMLStyleElement
function ensureStyleElement() {
    if (!focusStyle) {
        focusStyle = document.createElement('style')
        focusStyle.textContent = ":is([bornagain], #bornagainnnn > #woo > #barked) { outline: 1px solid red !important; }"
    } 
    if (!focusStyle.isConnected) document.documentElement.appendChild(focusStyle)
}