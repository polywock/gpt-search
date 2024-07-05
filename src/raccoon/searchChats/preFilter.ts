import { Chat, ChatPart } from "../types"
import { PreFilter } from "./extractOpts"

export function preFilterChats(chats: Chat[], opts: PreFilter): ChatPart[] {

    if ((opts as any).archive != null) {
        opts.archived = (opts as any).archive
    }

    chats = chats.filter(c => {
        if (opts.dalle != null && opts.dalle != !!c.usedDalle) return false 
        if (opts.browse != null && opts.browse != !!c.usedBrowser) return false 
        if (opts.python != null && opts.python != !!c.usedPython) return false 
        if (opts.gizmo != null && opts.gizmo != !!c.gizmoId) return false 
        if (opts.gizmos != null && opts.gizmos != !!c.multiGizmo) return false 
        if (opts.gpt4 != null && opts.gpt4 != !!c.usedGPT4) return false 
        if (opts.archived != null && opts.archived != !!c.isArchived) return false 

        if (opts.createdAfter && (c.createTime < opts.createdAfter || c.createTime == null)) return false
        if (opts.createdBefore && (c.createTime > opts.createdBefore || c.createTime == null)) return false
        if (opts.updatedAfter && (c.updateTime < opts.updatedAfter || c.updateTime == null)) return false
        if (opts.updatedBefore && (c.updateTime > opts.updatedBefore || c.updateTime == null)) return false

        if (opts.turnsPlus && (c.childCount < opts.turnsPlus || c.childCount == null)) return false
        if (opts.turnsMinus && (c.childCount > opts.turnsMinus || c.childCount == null)) return false
        if (opts.gizmoIds && !opts.gizmoIds.has(c.gizmoId)) return false 
        
        return true 
    })

    const messageParts: ChatPart[] = []

    
    chats.forEach(c => {
        if (opts.gpt && c._gizmo) {
            messageParts.push({
                type: 'gpt',
                content: c._gizmo.name,
                chat: c
            }) 
        } else if (opts.title && !c._gizmo) {
            messageParts.push({
                type: 'title',
                content: c.title,
                chat: c
            }) 
        } 

        c.userChilds.forEach(v => v.chat = c)
        c.astChilds.forEach(v => v.chat = c)
        
        if (opts.user) messageParts.push(...c.userChilds)
        if (opts.ast) messageParts.push(...c.astChilds)
    })

    return messageParts
}
