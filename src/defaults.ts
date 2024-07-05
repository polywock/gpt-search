
import { Config } from "./types";
import { loadGsm } from "./utils/gsm";

export const CURRENT_VERSION = 1 


export async function generateConfig() {
    gvar.gsm = await loadGsm()
    return ({
        'g:version': CURRENT_VERSION
    }) satisfies Partial<Config>
}