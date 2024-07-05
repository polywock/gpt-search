import { useEffect, useState } from "react"
import { clamp } from "../../helper"

type DragRef = {
    x: number,
    y: number,
    w: number,
    h: number 
}

type Bounds = {
    w: number,
    h: number 
}


export function useResize(mainRef: React.MutableRefObject<React.ElementRef<'div'>>) {
    const [dragRef, setDragRef] = useState(null as DragRef)
    const [windowSize, setWindowSize] = useState({w: 350, h: 60} as Bounds)

    useEffect(() => {
        if (!dragRef) return 
        const handleMove = (e: PointerEvent) => {
            const deltaX = e.clientX - dragRef.x
            const x = clamp(300, 600, dragRef.w + deltaX)

            const deltaY = (e.clientY - dragRef.y) / window.innerHeight * 100
            let y = clamp(50, 80, Math.min(dragRef.h + deltaY, mainRef.current.scrollHeight / window.innerHeight * 100))

            setWindowSize({w: x, h: y})
        }
        const handleUp = (e: PointerEvent) => {
            handleMove(e)
            setDragRef(null)
        }
        window.addEventListener('pointermove', handleMove, {capture: true})
        window.addEventListener('pointerup', handleUp, {capture: true})

        return () => {
            window.removeEventListener('pointermove', handleMove, {capture: true})
            window.removeEventListener('pointerup', handleUp, {capture: true})
        }
    }, [dragRef])

    return [
        <div className="scale" onPointerDownCapture={e => {
            setDragRef({x: e.clientX, y: e.clientY, w: windowSize.w, h: windowSize.h})
        }}/>,
        windowSize
    ] as [React.ReactElement<HTMLDivElement>,Bounds]
}
