import debounce from "lodash.debounce"
import { AnyDict } from "../types"
import type { DebouncedFunc } from "lodash"
import { randomId } from "../helper"

export type SubStorageCallback = (view: AnyDict, forOnLaunch?: boolean) => void

export class SubscribeStorageKeys {
    keys: Set<string>
    cbs: Set<SubStorageCallback> = new Set()
    private rawMap?: AnyDict
    latestRaw?: AnyDict
    released = false 
    processedChangeIds: Set<string> = new Set() 

    constructor(_keys: string[], private onLaunch?: boolean, cb?: SubStorageCallback, public wait?: number, public maxWait?: number) {
        this.triggerCbs = this.wait ? (
            debounce(this._triggerCbs, this.wait ?? 0, {trailing: true, leading: true, ...(this.maxWait == null ? {} : {maxWait: this.maxWait})})
        ) : this._triggerCbs

        this.keys = new Set(_keys)
        cb && this.cbs.add(cb)
        this.start()
    }
    start = async () => {
        chrome.storage.local.onChanged.addListener(this.handleChange)
        if (this.onLaunch) {
            await this.handleChange(null)
        }
    }
    release = () => {
        if (this.released) return 
        this.released = true 
        ;(this.triggerCbs as any).cancel?.()
        delete this.triggerCbs
        chrome.storage.local.onChanged.removeListener(this.handleChange)
        this.cbs.clear()
        delete this.cbs, delete this.rawMap, 
        delete this.latestRaw, delete this.keys, delete this.rawMap
    }
    handleChange = async (changes: chrome.storage.StorageChanges) => {
        changes = changes ?? {} 
        const changeId = changes["o:changeId"]?.newValue as string
        if (changeId) {
            if (this.processedChangeIds.has(changeId)) {
                this.processedChangeIds.delete(changeId)
                return
            }  else {
                this.processedChangeIds.add(changeId)
            }
        }

        let hadChanges = false 
        if (!this.rawMap) {
            this.rawMap = await chrome.storage.local.get([...this.keys])
            hadChanges = true 
        }
        for (let key in changes) {
            if (!this.keys.has(key)) continue 
            this.rawMap[key] = changes[key].newValue
            if (this.rawMap[key] === undefined) delete this.rawMap[key]
            hadChanges = true 
        }
        if (!hadChanges) return 

        this.latestRaw = structuredClone(this.rawMap)
        this.triggerCbs()
    }
    _triggerCbs = () => {
        this.cbs.forEach(cb => cb(this.latestRaw))
    }
    triggerCbs: typeof this._triggerCbs | DebouncedFunc<typeof this._triggerCbs>
    
    push = (_override: AnyDict) => {
        const override = structuredClone(_override)
        override["o:changeId"] = randomId()

        const changes = {} as chrome.storage.StorageChanges
        for (let key in override) {
            if (override[key] === undefined) continue 
            changes[key] = {newValue: override[key]} 
        }

        return Promise.all([
            this.handleChange(changes),
            chrome.storage.local.set(override)
        ])
    }
}