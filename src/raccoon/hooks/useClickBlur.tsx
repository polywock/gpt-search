import { useEffect } from "react"

export function useClickBlur(blur: boolean, pinned: boolean, setBlur: (newValue: boolean) => any) {
    useEffect(() => {
        if (blur || pinned) return 

        const handleClick = (e: PointerEvent) => {
            if (e.target !== gvar.preambleHost && e.target !== gvar.raccoonHost) {
                setBlur(true)
            }
        }
        
        window.addEventListener('pointerdown', handleClick, true)

        return () => {
            window.removeEventListener('pointerdown', handleClick, true)
        }
    }, [blur, pinned])
}