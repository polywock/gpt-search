import { useEffect, useRef } from "react"
import { SearchChats } from "../searchChats"


let latestWasIntersected = false 

export function LoadMore(props: {}) {
    const ref = useRef(null as HTMLDivElement)
    useEffect(() => {
        const obs = new IntersectionObserver(entries => {
            latestWasIntersected = entries.at(-1).isIntersecting
            if (latestWasIntersected) {
                SearchChats.ref?.loadSafely()
            }
        }, {
            threshold: 0.75,
            root: ref.current.parentElement
        })
        obs.observe(ref.current)

        const intervalId = setInterval(() => {
            if (latestWasIntersected) {
                SearchChats.ref?.loadSafely()
            }
        }, 100)

        return () => {
            obs.disconnect()
            clearInterval(intervalId)
        }
    }, [ref.current, ref.current?.parentElement])

    return  <div ref={ref} className="LoadMore"></div> 
}

