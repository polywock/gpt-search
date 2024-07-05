import { Chat } from "../types"
import { ConversationInterface } from "./rawTypes"

export function extractChat(json: ConversationInterface) {
    let chat: Partial<Chat> = {}
    chat.id = json.id ?? json.conversation_id
    chat.gizmoId = json.gizmo_id
    chat.createTime = json.create_time ? new Date(json.create_time).getTime() : null 
    chat.updateTime = json.update_time ? new Date(json.update_time).getTime() : null 
    chat.title = json.title
    chat.isArchived = json.is_archived
    chat.currentNodeId = typeof json.current_node === "string" ? json.current_node : null 
    
    chat.astChilds = []
    chat.userChilds = []

    const gizmoIds = new Set<string>()

    for (let [_, mapping] of Object.entries(json.mapping ?? {})) {
        const m = mapping.message
        if (!m) continue 

        if (m.metadata) {
            if (m.metadata.gizmo_id) gizmoIds.add(m.metadata.gizmo_id)
            if (m.metadata.model_slug?.startsWith('gpt-4')) chat.usedGPT4 = true 
        }

        if (m.author?.role === 'tool') {
            if (m.author.name === 'dalle.text2im') chat.usedDalle = true 
            if (m.author.name === 'python') chat.usedPython = true 
            if (m.author.name === 'browser') chat.usedBrowser = true 
        }

        // text extraction 
        if (!(m.id && m.author && m.content?.parts) || m.metadata?.is_visually_hidden_from_conversation) continue 
        if (!(m.content.content_type === "text" || m.content.content_type === "multimodal_text")) continue 
        if (!(m.author.role === "user" || m.author.role === "assistant")) continue 

        const isUser = m.author.role === "user" 
        const texts: string[] = []
        m.content.parts.forEach(part => {
            if (typeof part === "string") texts.push(part)
        })
        const text = texts.join('\n\n').trim()

        text.length && (
            chat[isUser ? 'userChilds' : 'astChilds'].push({
                type: 'message',
                content: text,
                messageId: m.id,
                byAst: m.author.role === "assistant"
            })
        )
    }

    chat.gizmoIds = [...gizmoIds]

    if (chat.gizmoIds.length === 1) {
        chat.gizmoId = chat.gizmoIds[0]
    } else if (chat.gizmoIds.length > 1) {
        chat.multiGizmo = true 
    }

    chat.childCount = chat.astChilds.length + chat.userChilds.length

    return chat as Chat 
}


