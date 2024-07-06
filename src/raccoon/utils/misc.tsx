
export function softLink(path: string, blockScroll?: number) {
    window.dispatchEvent(new CustomEvent('busbusab', {detail: JSON.stringify({type: 'NAV', path, blockScroll}), bubbles: false}))
}

export function blockScroll(blockScroll: number) {
    window.dispatchEvent(new CustomEvent('busbusab', {detail: JSON.stringify({type: 'BLOCK_SCROLL', blockScroll}), bubbles: false}))
}


