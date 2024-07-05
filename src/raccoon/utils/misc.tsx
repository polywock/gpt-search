
export function softLink(path: string, blockScroll?: number) {
    window.dispatchEvent(new CustomEvent('busbusab', {detail: JSON.stringify({type: 'NAV', path, blockScroll}), bubbles: false}))
}


