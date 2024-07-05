

type CleverDivProps = React.HTMLProps<HTMLDivElement> & {
    onCleverClick?: (e: React.KeyboardEvent | React.PointerEvent) => void 
}

export function CleverDiv(props: CleverDivProps) {
    let p = {...props}
    const cleverClick = p.onCleverClick
    const ogPointerUp = p.onPointerUp 
    const ogKeyUp = p.onKeyUp 
    
    delete p.onCleverClick

    if (cleverClick) {
        delete p.onPointerUp 
        delete p.onKeyUp
    }

    return <div {...p} {...(cleverClick ? {
        onPointerUp: e => {
            if (e.button === 0) cleverClick(e)
            ogPointerUp?.(e)
        },
        onKeyDown: e => {
            if (e.key === "Enter") {
                cleverClick(e)
            }
            ogKeyUp?.(e)
        }
    } : {})}/>
}