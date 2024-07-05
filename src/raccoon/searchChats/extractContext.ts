const FULL_STOP = /[?!\.。！？۔।॥\|¡¿\n\t]/

export type Context = {prefix: string, needle: string, suffix: string}

export function getContext(content: string, start: number, end: number, context = 2) {
    if (!end || start === end) return {prefix: content.slice(0, context * 200), suffix: '', needle: ''}

    content = content.trim() // replace(/\n+/, '\n')
    const preContext = Math.ceil(context / 2)
    const postContext = context - preContext

    const needle = content.slice(start, end)

    let prefix = ''
    if (start) {
        const tempPrefix = content.slice(0, start).split('').reverse().join('')
        prefix = collectSearch(tempPrefix, preContext, preContext * 100, true).split('').reverse().join('').trimStart()
    }

    const tempSuffix = content.slice(end)
    let suffix = collectSearch(tempSuffix, postContext, postContext * 100).trimEnd()
    return {prefix, needle, suffix} as Context
}


export function collectSearch(content: string, n: number, max: number, minus?: boolean) {
    let collected = 0 
    for (let i = 0; i < n; i++) {
        const idx = content.slice(collected).search(FULL_STOP)
        if (idx === -1) return content.slice(0, max)

        collected += idx + 1 
    }
    return content.slice(0, Math.min(minus ? collected - 1 : collected, max))
}