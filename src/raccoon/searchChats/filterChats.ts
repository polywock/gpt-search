import { Chat, ChatPart, MessagePart, PartResult, Result } from "../types"
import { extractOpts } from "./extractOpts"
import { getElapsed } from "../utils/getElapsed"
import { preFilterChats } from "./preFilter"
import { Context, getContext } from "./extractContext"
import { getGizmoByIdSync } from "../utils/gizmo"
import { search } from "./core"

const DELIM = /\s*&&\s*/

export function multiFilterChats(chats: Chat[], _query: string, contextLevel: number): Result[] {
    // filter chats  
    for (let query of _query.split(DELIM)) {
        chats = filterChats(chats, query, contextLevel)
    }

    return chats.map(c => chatToResult(c)) 
}



function filterChats(chats: Chat[], _query: string, contextLevel: number): Chat[] {
    if (!chats?.length) return []

    let {query, opts} = extractOpts(_query)
    const parts = preFilterChats(chats, opts)

    // after pre-filtering, there might not be any query left.
    query = query.trim()
    if (query === "") return rebuildChats(parts) 


    const solts = search(parts.map(c => c.content), query, {
        threshold: (gvar.config["g:strictSearch"] && !gvar.gsm._morpho) ? 40 : 20,
        ordered: !gvar.config["g:orderByDate"]
    })
    if (!solts.length) return []
    
    let newParts: ChatPart[] = []

    try {
        for (let solt of solts) {
            const part = parts[solt.idx]
            if (!(solt.rb || part.type === "title")) continue 
            let ctx: Context 
            if (contextLevel) {
                ctx = getContext(part.content, solt.lb, solt.rb, contextLevel)
            }
            newParts.push(part)
    
            part.result = {
                messageId: (part as MessagePart).messageId,
                ...(ctx ?? {})
            }
        }
    } catch (err) {
        console.error(err)
    }

    return rebuildChats(newParts)
}

function chatToResult(c: Chat): Result {

    let headerResult: PartResult
    const headerIdx = c.parts.findIndex(p => p.type === "title" || p.type === "gpt")
    if (headerIdx >= 0) {
        headerResult = c.parts.splice(headerIdx, 1)[0].result
    }

    let gizmoName: string 
    let gizmoImg: string 
    let gizmoId: string 

    if (c._gizmo) {
        gizmoName = c._gizmo.name,
        gizmoImg = c._gizmo.imageUrl,
        gizmoId = `g-${c._gizmo.id}`
    } else if (c.gizmoId) {
        let info = getGizmoByIdSync(c.gizmoId.slice(2))
        if (info) {
            gizmoName = info.name
            if (gvar.config["g:showImage"]) gizmoImg = info.imageUrl
        }
    }

    return {
        id: c.id,
        title: c._gizmo?.name ?? c.title,
        elapsed: c.updateTime ? getElapsed(c.updateTime, gvar.gsm?._lang ?? 'en') : null,
        parts: c.parts.map(c => c.result).filter(v => v),
        headerResult,
        gizmoId: gizmoId ?? c.gizmoId,
        isGpt: c._gizmo ? true : false,
        gizmoName,
        gizmoImg,
        currentNodeId: c.currentNodeId
    }
}

function rebuildChats(parts: ChatPart[]) {
    const chatSet: Set<Chat> = new Set() 
    const chats: Chat[] = []

    parts.forEach(part => {
        const chat = part.chat 
        if (!chatSet.has(chat)) {
            chat.parts = []
            chatSet.add(chat)
            chats.push(chat)
        } 

        // // if no result with +gg. 
        // if (part.type === 'message' && !part.result) {
        //     part.result = {
        //         messageId: part.messageId,
        //         needle: '',
        //         prefix: part.content.slice(0, 35).concat('...'),
        //         suffix: ''
        //     }
        // }
        
        chat.parts.push(part)
    })
    
    return chats
}

