import { CURRENT_VERSION, generateConfig } from "../defaults"
import { CONFIG_KEYS, Config } from "../types"

chrome.runtime.onInstalled.addListener(async () => {
    chrome.storage.session.setAccessLevel?.({accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS'})
    ensureMigrated()
})

export async function ensureMigrated() {
    let config = await chrome.storage.local.get(CONFIG_KEYS)
    config = await migrateConfig(config)
    await chrome.storage.local.set(config)
}

async function migrateConfig(config: Partial<Config>) {
    const version = config["g:version"]
    if (version === 1) {
        config = config 
    }
    if (config["g:version"] !== CURRENT_VERSION) {
        return generateConfig()
    }
    return config 
}

async function migrateOneToTwo(config: Partial<Config>): Promise<Partial<Config>> {
    return config 
}

