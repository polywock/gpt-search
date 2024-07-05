
declare module '*.css?raw' {
    const content: string;
    export default content;
}

declare namespace chrome.storage {
    export type StorageChanges = {[key: string]: chrome.storage.StorageChange}
    
    export type StorageKeysArgument = string | string[] | {[key: string]: any} | null | undefined

    export type StorageGet = string | string[] | { [key: string]: any }; 
}
  