import { Gizmo } from "../types"

export type Status = {
    results: Result[],
    finished?: boolean

}

export type Chats = {
    page: number,
    chats: Chat[],
    indexed: number,
    hasMore: boolean,
    maxPages: number
}

export type Chat = {
    id: string,
    gizmoId?: string,
    gizmoIds?: string[],
    multiGizmo?: boolean,
    usedDalle?: boolean,
    usedBrowser?: boolean,
    usedPython?: boolean,
    usedGPT4?: boolean,
    childCount?: number, // ast + user 

    createTime: number,
    updateTime: number,
    title: string,
    isArchived: boolean,
    userChilds: MessagePart[],
    astChilds: MessagePart[],
    parts?: ChatPart[],
    currentNodeId?: string,
    
    _gizmo?: Gizmo
}

export type MessagePart = {
    type: 'message',
    messageId: string,
    byAst?: boolean,
    content?: string,
    chat?: Chat,
    result?: PartResult
}

export type TitlePart = {
    type: 'title',
    content?: string,
    chat?: Chat,
    result?: PartResult
}

export type GptPart = {
    type: 'gpt',
    content?: string 
    chat?: Chat,
    result?: PartResult,
    gptId?: string 
}

export type ChatPart = MessagePart | TitlePart | GptPart


export type LoadRequest = {
    page?: number,
    cached?: Chats 
}


export type Result = {
    title: string,
    id: string,
    elapsed?: string,
    parts: PartResult[],
    headerResult?: PartResult,
    isGpt?: boolean, 
    currentNodeId?: string,

    gizmoId?: string,
    gizmoImg?: string
    gizmoName?: string 
}

export type PartResult = {
    messageId?: string,
    prefix?: string
    suffix?: string
    needle?: string 
}
