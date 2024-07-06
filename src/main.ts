let blockScrollId: number 

window.addEventListener('busbusab', (e: CustomEvent) => {
    const deets = JSON.parse(e.detail)
    if (deets.type === 'NAV') {
        if ((window as any).next?.router?.push) {
            (window as any).next.router.push(deets.path)
            // deets.blockScroll && activateScrollBlock(deets.blockScroll)
        } else {
            window.dispatchEvent(new CustomEvent('rusrusar', {detail: JSON.stringify({type: 'NO_PUSH', path: deets.path}), bubbles: false}))
        }
    }  else if (deets.type === "BLOCK_SCROLL") {
        // deets.blockScroll && activateScrollBlock(deets.blockScroll)
    }
    e.stopImmediatePropagation()
}, {capture: true})

// function activateScrollBlock(ms: number) {
//     clearBlockScrollId()
//     blockScrollId = window.setTimeout(clearBlockScrollId, ms)
// }

// function clearBlockScrollId() {
//     clearTimeout(blockScrollId)
//     blockScrollId = null 
// }



// function shimScroll() {
//     const ogFunc = window.scrollTo
//     if (!ogFunc) return 

//     const newFunc = function(...args: any[]) {
//         if (blockScrollId) {
//             return undefined
//         }
//         return ogFunc.apply(this, args)
//     }
//     window.scrollTo = newFunc 
// }

// let appliedScroll: {value: number, element: any, time: number}
// let prev: number 

function shimScroll2() {
    let originalDesc = Object.getOwnPropertyDescriptor(Element.prototype, "scrollTop")
    Object.defineProperty(Element.prototype, "scrollTop", {set: function(value: number) {
        window.dispatchEvent(new CustomEvent("rusrusar", {detail: JSON.stringify({type: "SCROLL_SET"})}))
        return originalDesc.set.call(this, value)
    }, get: originalDesc.get, configurable: true})
}



// shimScroll()
shimScroll2()