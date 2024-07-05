import { Gizmo } from "../../types"
import { getLocalItem } from "../../utils/getKnown"
import { Chat } from "../types"

let gizmos: {[key: string]: Gizmo}

export async function getGizmoById(id: string) {
    await ensureLoaded()
    if (!gizmos) return 
    return gizmos[id]  
}

export function getGizmoByIdSync(id: string) {
    return gizmos[id]  
}

export function getGizmosSync() {
    return Object.entries(gizmos ?? {}).map(v => v[1])
}

async function ensureLoaded() {
    if (!gizmos) {
        gizmos = await getLocalItem('o:gizmos') || {}
    }
}

export async function getGizmosAsChats(): Promise<Chat[]> {
    await ensureLoaded()
    if (!gizmos) return []

    return Object.entries(gizmos).map(([k, g]) => ({
        astChilds: [],
        userChilds: [],
        title: g.name,
        id: g.id,
        gizmoId: `g-${g.id}`,
        _gizmo: g 
    })) as Chat[]
}