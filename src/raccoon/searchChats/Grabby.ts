import { QueueLock } from "../../helper"
import { Chats } from "../types"
import { fetchChats } from "../utils/fetchChats"
import { getTtl } from "../utils/getTtl"
import { getGizmosAsChats } from "../utils/gizmo"



export class Grabby {
    static lastFetch = new QueueLock()
    static lastFetchActive = new QueueLock()
    static maxPages: number = Infinity

    static fetchMap: {[key: string]: Promise<void>} = {}
    static bgFetchMap: {[key: string]: Promise<void>} = {}

    static requestFetch = async (page: number, oldChats?: Chats) => {
        const key = (oldChats ? "bgFetchMap" : "fetchMap") satisfies keyof typeof Grabby

        let prom = Grabby[key][page]
        const now = Date.now() 
        if (prom && prom.time > (now - 60_000 * 10)) {
            return prom 
        }
        Grabby[key][page] = this.fetchChatsAndSave(page, oldChats)
        Grabby[key][page].time = now 
        prom = Grabby[key][page]
        
        return prom 
    }
    static fetchChatsAndSave = async (page: number, oldChats?: Chats) => {
        if (oldChats) {
            await Grabby.lastFetch.wait(3_000)
        } else {
            await Grabby.lastFetchActive.wait(3_000)
        }
        
        const chats = await fetchChats(page, gvar.auth)
        Grabby.maxPages = chats.maxPages
        
        await gvar.setItems({[`o:c:${page.toFixed(0)}`]: chats})
        
        if (oldChats) await this.backgroundShift(chats, oldChats)
    }
    static backgroundShift = async (chats: Chats, oldChats: Chats) => {
        const current = new Set(chats.chats.map(c => c.id))
        const ghosts = oldChats.chats.filter(c => !current.has(c.id))
        const key = `o:c:${(chats.page + 1).toFixed(0)}`
        const nextPage = (await gvar.getItems(key))[key] as Chats 
        if (!nextPage) return 
        nextPage.chats = [...nextPage.chats, ...ghosts]
        await gvar.setItems({[key]: nextPage})
    }   
    static getCached = async (page: number) => {
        const key = `o:c:${page.toFixed(0)}`
        const cached = (await gvar.getItems([key]))[key] as Chats
        if (cached) {
            if (cached.indexed < Date.now() - getTtl(page)) Grabby.requestFetch(page, cached)
            return cached 
        }
    }
    static getPage: (page: number) => Promise<Chats> = async page => {
        if (page === -1) {
            return {chats: await getGizmosAsChats(), hasMore: true} as Chats
        }

        // cached 
        let cached = await Grabby.getCached(page)
        if (cached) return cached 

        await Grabby.requestFetch(page)
        cached = await Grabby.getCached(page)
        if (cached) return cached 

        return {page, chats: [], hasMore: false, indexed: Date.now()} as Chats 
    }
}