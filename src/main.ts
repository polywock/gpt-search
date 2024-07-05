
window.addEventListener('busbusab', (e: CustomEvent) => {
    const deets = e.detail
    if (deets.type === 'NAV') {
        if ((window as any).next?.router?.push) {
            (window as any).next.router.push(deets.path)
        } else {
            window.dispatchEvent(new CustomEvent('rusrusar', {detail: {type: 'NO_PUSH', path: deets.path}, bubbles: false}))
        }
    } 
    e.stopImmediatePropagation()
}, {capture: true})
