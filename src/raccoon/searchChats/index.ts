import { Result, Status } from "../types"
import { multiFilterChats, filterChatData } from "./filterChats"
import { produce } from "immer"
import { Grabby } from "./Grabby"
import debounce from "lodash.debounce"
import { fetchChatData } from "../utils/fetchChats"
import { parseChatData } from "../utils/extractChats"
import { searchChatData } from "./core"

declare global {
    interface Promise<T> {
      time?: number
    }
}


export class SearchChats {
    released = false 
    page = -2
    latestResults: Result[] = []
    locked = false 
    errorCount = 0
    throttleTimeoutId: number
    context = 2
    processed: Set<string> = new Set()
    initAwait: Promise<void> 

    constructor(private query: string, private setStatus: (status: Status) => void, private mainRef: React.MutableRefObject<HTMLDivElement>) {
        SearchChats.ref = this
        this.initAwait = this.start()
    }
    start = async () => {
        if (this.released) return
        this.context = gvar.config["g:context"] ?? 2
        this.loadSafely()
    }  
    next = async (replace?: boolean) => {
        this.page++
        const data = await Grabby.getPage(this.page)
        if (this.released) return

        if (replace) {
            this.latestResults = []
            this.mainRef.current?.scrollTo({left: 0, top: 0, behavior: 'instant'})  
        } else {
            this.setStatus?.({results: this.latestResults})
        }


        // ignore duplicates 
        data.chats = data.chats.filter(c => {
            if (this.processed.has(c.id)) return false 
            this.processed.add(c.id)
            return true 
        })

        let res: Result[]
        try {
            const chats = [...data.chats]
            res = multiFilterChats(chats, this.query, this.context) ?? []
        } catch (err) {
            console.error('ERROR', err)
            throw err
        }
        

        this.latestResults = produce(this.latestResults, d => {
            d.push(...res)
        })
 
        this.setStatus?.({
            results: this.latestResults,
            finished: !data.hasMore
        })
    }
    loadSafely = debounce(async () => {
        await this.initAwait
        if (this.released || this.locked || (this.page + 1 >= Grabby.maxPages) || this.errorCount > 10) return 

        this.locked = true 
        this.next().then(() => {
            this.errorCount = 0
            this.locked = false
        }, err => {
            this.errorCount++
            this.locked = false
        })
    }, 50, {trailing: true, leading: true, maxWait: 50})
    release = () => {
        if (this.released) return 
        delete this.setStatus
        this.released = true 
        delete SearchChats.ref
        clearTimeout(this.throttleTimeoutId)
    }
    static ref: SearchChats
}

export async function fetchAndProcessChatData(auth: string) {
    const rawData = await fetchChatData(auth);
    const parsedData = rawData.map(parseChatData);
    return parsedData;
}

export async function filterAndSearchChats(auth: string, criteria: any, searchTerms: string[]) {
    const chatData = await fetchAndProcessChatData(auth);
    const filteredData = filterChatData(chatData, criteria);
    const searchResults = searchChatData(filteredData, searchTerms);
    return searchResults;
}
