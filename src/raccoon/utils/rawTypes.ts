
export type ConversationInterface = {
    title: string,
    create_time: TimeSeconds, 
    update_time: TimeSeconds,
    mapping: {[key: Id]: Mapping},
    current_node: Id,
    id?: Id,
    conversation_id?: Id,
    conversation_template_id?: string,
    gizmo_id?: string,
    is_archived?: boolean
}

type Id = string 
type TimeSeconds = number 

type Mapping = {
    id: Id, 
    message: Message,
    parent: Id,
    children: Id[]
}

type Message = {
    id: Id, 
    author: Author,
    create_time: null,
    update_time: null,
    content: Content,
    status: "finished_successfully" | string,
    end_turn: boolean,
    weight: number,
    metadata: MessageMetadata,
    recipient: "all" | string 
}

type Author = {
    role: "system" | "user" | "assistant" | "tool"
    name: string,
    metadata: {}
}

type Content = TextContent | MultiModalContent

type TextContent = {
    content_type: "text",
    parts: string[]
}

type MultiModalContent = {
    content_type: "multimodal_text",
    parts: (MultiModalContentPart | string)[]
}

type MultiModalContentPart = {
    content_type: "image_asset_pointer" | string,
    asset_pointer: string,
    size_bytes: number,
    width?: number,
    height?: number
}

type MessageMetadata = {
    is_visually_hidden_from_conversation: boolean,
    gizmo_id?: string,
    model_slug?: string 
}