
let blockScrollId: number 

window.addEventListener('busbusab', (e: CustomEvent) => {
    const deets = JSON.parse(e.detail)
    if (deets.type === 'NAV') {
        if ((window as any).next?.router?.push) {
            (window as any).next.router.push(deets.path)
        } else if ((window as any).__remixRouter?.navigate) {
            (window as any).__remixRouter.navigate(deets.path)
        } else {
            window.dispatchEvent(new CustomEvent('rusrusar', {detail: JSON.stringify({type: 'NO_PUSH', path: deets.path}), bubbles: false}))
        }
    }  else if (deets.type === "BLOCK_SCROLL") {
    }
    e.stopImmediatePropagation()
}, {capture: true})


function shimScroll2() {
    let originalDesc = Object.getOwnPropertyDescriptor(Element.prototype, "scrollTop")
    Object.defineProperty(Element.prototype, "scrollTop", {set: function(value: number) {
        window.dispatchEvent(new CustomEvent("rusrusar", {detail: JSON.stringify({type: "SCROLL_SET"})}))
        return originalDesc.set.call(this, value)
    }, get: originalDesc.get, configurable: true})
}

shimScroll2()