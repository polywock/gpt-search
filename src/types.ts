

export type Config = {
    'g:version': number,
    'g:lang': string,
    'g:context': number,
    'g:autoClear': boolean,
    'g:highlightColorDark': string,
    'g:highlightColorLight': string,
    'g:highlightUnderline': boolean,
    'g:highlightBold': boolean,
    'g:showImage': boolean,
    'g:sessionOnly': boolean,
    'g:orderByDate': boolean,
    'g:scrollTop': boolean,
    'g:strictSearch': boolean,
}

export type TempState = {
    'o:lastTheme': string,
    'o:auth': string,
    'o:ph': string,
    'o:changeId': string,
    'o:gizmos': {
        [key: string]: Gizmo 
    }
}

export type SessionState = {
    's:auth': string
}

export type Gizmo = {
    id: string,
    name: string,
    added: number,
    imageUrl: string 
}

export type LocalState = Config & TempState

export const CONFIG_KEYS = ['g:version', 'g:lang', 'g:context', 'g:autoClear', 'g:highlightColorDark', 'g:highlightColorLight', 'g:highlightUnderline', 'g:highlightBold', 'g:showImage', 'g:sessionOnly', 'g:orderByDate', 'g:scrollTop', 'g:strictSearch'] as const

export const TEMP_KEYS = ['o:lastTheme', 'o:auth', 'o:ph', 'o:changeId', 'o:gizmos'] as const 

export const KNOWN_KEYS = [...CONFIG_KEYS, ...TEMP_KEYS] as const 


export type AnyDict = {[key: string]: any}

export type StringDict = {[key: string]: string}

