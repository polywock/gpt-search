import { useLayoutEffect } from "react"
import { isFirefox } from "../../options/utils"

export function useAutoBar(blur: boolean, searchRef: React.MutableRefObject<HTMLInputElement>) {
    useLayoutEffect(() => {
        if (blur) {
            enterSidebar()
        } else {
            exitSidebar()
            searchRef.current.focus()
            isFirefox() && requestAnimationFrame(() => {
                searchRef.current.focus()
            })
        }
    }, [blur, searchRef])
}

function enterSidebar() {
    gvar.preambleProxy.insertAdjacentElement('afterbegin', gvar.raccoonHost)
    gvar.preambleHost.remove()
}

function exitSidebar() {
    gvar.preambleProxy.insertAdjacentElement('afterbegin', gvar.preambleHost)
    document.documentElement.appendChild(gvar.raccoonHost)
}