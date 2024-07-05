
export const gvar = ((globalThis.document ?? globalThis) as any).gvar ?? {}
;((globalThis.document ?? globalThis) as any).gvar  = gvar 