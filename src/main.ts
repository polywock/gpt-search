let blockScrollId: number 

window.addEventListener('busbusab', (e: CustomEvent) => {
    const deets = JSON.parse(e.detail)
    if (deets.type === 'NAV') {
        if ((window as any).next?.router?.push) {
            (window as any).next.router.push(deets.path)
            if (deets.blockScroll) {
                clearBlockScrollId()
                blockScrollId = window.setTimeout(clearBlockScrollId, deets.blockScroll)
            }
        } else {
            window.dispatchEvent(new CustomEvent('rusrusar', {detail: {type: 'NO_PUSH', path: deets.path}, bubbles: false}))
        }
    } 
    e.stopImmediatePropagation()
}, {capture: true})

function clearBlockScrollId() {
    blockScrollId = null 
}

function shimScroll() {
    const ogFunc = window.scrollTo
    if (!ogFunc) return 

    const newFunc = function(...args: any[]) {
        if (blockScrollId) {
            return undefined
        }
        return ogFunc.apply(this, args)
    }
    window.scrollTo = newFunc 
}



shimScroll()
