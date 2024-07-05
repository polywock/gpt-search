import { getGizmosSync } from "../utils/gizmo"
import { search } from "./core"

const optBaseFlags = ['dalle', 'browse', 'python', 'gizmo', 'gizmos', 'title', 'gpt', 'body', 'ast', 'user', 'gpt4', 'archived', 'archive', 'g']
const optSourceMapping = [
    ['+c', 'createdAfter', 'date'], ['-c', 'createdBefore', 'date'], 
    ['+u', 'updatedAfter', 'date'], ['-u', 'updatedBefore', 'date'],
    ['+turns', 'turnsPlus', 'int'], ['-turns', 'turnsMinus', 'int']
]

export function extractOpts(query: string): {query: string, opts: PreFilter} {
    let opts: PreFilter = {}
    let tokens = query.toLowerCase().split(' ')
    let tokensB: string[] = []

    tokens.forEach(token => {
        const suffix = token.slice(1)
        let matched = false 
        if (optBaseFlags.includes(suffix)) {
            if (token[0] === '+')  {
                (opts as any)[suffix] = true 
                matched = true
            } else if (token[0] === '-')  {
                (opts as any)[suffix] = false 
                matched = true
            } 
        }
        if (!matched) {
            tokensB.push(token.trim())
        }
    })

    let matched = false 
    tokens = []
    for (let [index, token] of tokensB.entries()) {
        if (matched) {
            matched = false 
            continue 
        }

        for (let [flag, propertyName, type] of optSourceMapping) {
            if (token === flag) {
                matched = true;
                const parsed = parseAs(tokensB[index + 1], type as any)
                if (parsed) (opts as any)[propertyName] = parsed
            }
        }
        if (!matched) {
            tokens.push(token.trim())
        }
    }
    // pre-processing 
    let exclusionMode = ![opts.ast, opts.body, opts.title, opts.user, opts.gpt].some(v => v)
    opts.title = opts.title || (exclusionMode && opts.title !== false)
    opts.gpt = opts.gpt || (exclusionMode && opts.gpt !== false)

    // False first to preserve specificity 
    opts.ast = opts.ast === false ? false : ( opts.ast || opts.body || (exclusionMode && opts.body !== false) )
    opts.user = opts.user === false ? false : ( opts.user || opts.body || (exclusionMode && opts.body !== false) )

    delete opts.body

    let _query = tokens.join(' ')

    if (opts.g) {
        opts.gizmoIds = findGizmoIdByTitle(_query)
        opts.title = true 
        opts.ast = opts.user = opts.gpt = false 
        return {query: '', opts}
    }

    return {query: _query, opts}
}

function parseAs(v: string, type: 'date' | 'int') {
    if (type === "date") {
        const d = parseDateAsYY(v)
        if (d) {
            return d.getTime() 
        } 
    } else if (type === "int") {
        const d = parseInt(v)
        if (d && !isNaN(d)) {
            return d 
        }
    }
}


const YY_REGEX = /^\d{4}[-\/:,\._]\d{1,2}[-\/:,\._]\d{1,2}$/;
function parseDateAsYY(v: string) {
    if (!v) return
    if (!YY_REGEX.test(v)) return
    return new Date(v)
}

export type PreFilter = {
    title?: boolean,
    body?: boolean,
    user?: boolean,
    ast?: boolean,

    dalle?: boolean
    browse?: boolean,
    python?: boolean,
    gizmo?: boolean,
    gizmos?: boolean,
    gpt4?: boolean,
    archived?: boolean,
    gpt?: boolean,
    g?: boolean,
    gg?: boolean,

    createdAfter?: number,
    createdBefore?: number,
    updatedAfter?: number,
    updatedBefore?: number 

    turnsPlus?: number,
    turnsMinus?: number,

    gizmoIds?: Set<string>
}


function findGizmoIdByTitle(query: string): Set<string> {
    const gizmos = getGizmosSync()
    return new Set((search(gizmos.map(g => g.name), query, {}) ?? []).map(s => `g-${gizmos[s.idx].id}`))
}