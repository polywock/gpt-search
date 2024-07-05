
import escapeStringRegexp from 'escape-string-regexp';

type Context = {
    opts: Options,
    exclude: string[],
    terms: Term[]
}


type Options = {
    ordered?: boolean,
    threshold?: number 
}

type Solt = {lb: number, rb: number, idx: number, score: number}

type Term = {
    needle: string,
    needleSize: number,
    groups: {match: string | RegExp, points: number}[][]
}

// First check if contains 
// Next check if contains strictly with delims. 

export function search(items: string[], query: string, opts: Options): Solt[] {
    const { needles, exclude } = getNeedlesAndExclude(query || "")

    if (needles.length === 0) {
        if (exclude.length) return getNonExcluded(items, exclude)
        return []
    }


    const env: Context = {
        exclude, 
        opts,
        terms: needles.map(needle => {
            let escaped = escapeStringRegexp(needle)?.trim()
            const term = {
                needle,
                needleSize: needle.length,
                groups: [
                    [{match: needle.toLocaleLowerCase(), points: 20}]
                ]
            } as Term

            try {
                term.groups.push(
                    [
                        {match: new RegExp(String.raw`${escaped}(?!\p{Letter})`, 'ui'), points: 20},
                        {match: new RegExp(String.raw`(?<!\p{Letter})${escaped}`, 'ui'), points: 30}
                    ],  
                    [{match: new RegExp(String.raw`(?<!\p{Letter})${escaped}(?!\p{Letter})`, 'ui'), points: 20}]  
                )
            } catch (err) { }

            return term 
        })
    }

    let newItems: Solt[] = []
    for (let i = 0; i < items.length; i++) {
        const item = items[i].toLocaleLowerCase()
        const solt = scoreItem(item, env)
        if (solt?.score >= (opts.threshold ?? 20)) newItems.push({...solt, idx: i} as Solt)
    }

    if (opts.ordered) {
        newItems.sort((a, b) => {
            return b.score - a.score 
        })
    }

    return newItems
}

function getNeedlesAndExclude(query: string) {
    let needles = []
    let current: string[] = []
    let exclude: string[] = []
    for (let token of query.split(' ')) {
        token = token.trim()
        const startsWithMinus = token.startsWith("-")
        if (startsWithMinus || token.startsWith("+")) {
            if (current.length) {
                needles.push(current.join(" ").trim())
                current = []
            }
            token.length > 1 && (startsWithMinus ? exclude : needles).push(token.slice(1))
            continue 
        } 
        token.length && current.push(token)
    }
    if (current.length) needles.push(current.join(" ").trim())
    
    return {needles, exclude}
}

function scoreWithTerm(v: string, term: Term, env: Context): Partial<Solt>  {
    let score = 0
    let lb: number 
    let rb: number 

    for (let group of term.groups) {
        let matched = false 
        for (let {match, points} of group) {
            let idx = typeof match === "object" ? v.search(match) : v.indexOf(match)
            if (idx < 0) continue 
            matched = true 
            score += points 
            lb = idx 
            rb = lb + term.needleSize
        }
        if (!matched) break 
    }

    return {score, lb, rb} 
}

function scoreItem(v: string, env: Context): Partial<Solt> {
    let highestRes: Partial<Solt> 

    for (let term of env.terms) {
        const res = scoreWithTerm(v, term, env)
        if (res && res.score > (highestRes?.score ?? -1)) {
            highestRes = res
        }
    }

    if (checkExcluded(v, env.exclude)) return 

    return highestRes
}


function checkExcluded(v: string, exclude: string[]) {
    for (let token of exclude) {
        if (v.includes(token)) return true 
    }
}

function getNonExcluded(items: string[], exclude: string[]) {
    let solts: Solt[] = []

    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (checkExcluded(item, exclude)) continue 
        solts.push({idx: i, lb: 0, rb: 0, score: 20})
    }
    return solts 
}