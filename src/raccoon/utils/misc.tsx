
export function softLink(path: string) {
    if ((window as any).wrappedJSObject) {
        (window as any).wrappedJSObject.next.router.push(path)
    } else {
        window.dispatchEvent(new CustomEvent('busbusab', {detail: {type: 'NAV', path}, bubbles: false}))
    }
}


