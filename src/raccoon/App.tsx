import { useEffect, useRef, useState } from "react"
import { SearchChats } from "./searchChats"
import { ResultItem } from "./comps/ResultItem"
import { Close, Gear, Github, Heart, Pin, SearchSvg, Star } from "../comps/svgs"
import { Status } from "./types"
import { LoadMore } from "./comps/LoadMore"
import { useAutoBar } from "./hooks/useAutoBar"
import { useClickBlur } from "./hooks/useClickBlur"
import clsx from "clsx"
import { Config } from "../types"
import { useResize } from "./hooks/useResize"
import { setupBlurDetection } from "./utils/blurDetection"

export const App = (props: {dark: boolean, top: number, left: number, config: Config}) => {
    const { config } = props 


    const [blur, setBlur] = useState(false)
    const [pinned, setPinned] = useState(false)
    const mainRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState("")
    const [status, setStatus] = useState<Status>(null)
    const blurRef = useRef(blur);
    const appRef = useRef<HTMLDivElement>(null);

    const smartBlur = useRef((value: boolean) => {
        if (value && config["g:autoClear"]) {
            setQuery("")
        }
        setBlur(value)
    })
    gvar.raccoonSearch = searchRef.current
    
    useAutoBar(blur, searchRef)
    useClickBlur(blur, !!query && pinned, smartBlur.current)
    const [scale, windowSize] = useResize(mainRef)


    useEffect(() => {
        if (!query) {
            setStatus(null)
            return 
        } 
        setStatus({results: []})
        mainRef.current.scrollTop = 0
        const searchChats = new SearchChats(query, setStatus, mainRef)
        return () => {
            searchChats?.release()
        }
    }, [query])

    const colorOverride = config[props.dark ? "g:highlightColorDark" : "g:highlightColorLight"]

    useEffect(() => {
		blurRef.current = blur;
	}, [blur]);

	useEffect(() => {
		searchRef.current.addEventListener(
			"blur",
			(e) => {
				if (blurRef.current) return; // Use the ref instead of state
				e.preventDefault(); // Prevent the blur action
				setTimeout(() => {
					searchRef.current?.focus();
				}, 0);
			},
			{ capture: true }
		);

		// Setup blur detection
		const removeBlurListeners = setupBlurDetection(
			blurRef,
            appRef,
			() => {
				setBlur(true);
			}
		);

		// Cleanup event listeners when component unmounts
		return () => {
			removeBlurListeners();
		};
	}, []);

    return <div id="App" ref={appRef} className={clsx({
        'peacock': !blur,
        dark: props.dark,
        bold: config["g:highlightBold"]
    })} style={{
        top: props.top,
        left: props.left,
        width: blur ? undefined : `${windowSize.w}px`
    }}>
        <div className="search">
            <SearchSvg className="searchIcon"/>
            <input onKeyDown={e => {
                if (e.key === "Escape") {
                    setQuery('')
                    setBlur(true)
                }
            }} ref={searchRef} onFocusCapture={e => setBlur(false)} autoFocus={true} type="text" placeholder={gvar.gsm.search} value={(blur && query) ? "..." : query} onChange={e => setQuery(e.target.value)}/>
            {query && <Close className="closeIcon" onClick={e => {
                setQuery('')
                setBlur(true)
            }}/>}
        </div>
        {!blur && (
            <>
                <div className="main" ref={mainRef} style={{
                    maxHeight: `${windowSize.h}vh`,
                    ...(colorOverride ? ({'--needle-color': colorOverride} as any) : {})
                }}>
                    {!!(status?.results.length) && status.results.map(v => (
                        <ResultItem scrollTop={config["g:scrollTop"]} result={v} key={v.id}></ResultItem>
                    ))} 
                    {status && !status.finished && <LoadMore/>}
                    {status && status.finished && !status.results?.length && <div className="NonFound">{gvar.gsm.notFound}</div>}
                    
                </div>
                <div className="footer">
                    <button className="svgButton" onClick={e => {
                        chrome.runtime.sendMessage({type: 'OPEN_LINK', url: chrome.runtime.getURL(`options.html`), active: true})
                    }}><Gear style={{transform: 'scale(1.2)'}}/></button>
                    <button className="svgButton" onClick={e => {
                        chrome.runtime.sendMessage({type: 'OPEN_LINK', url: `https://github.com/polywock/gpt-search`, active: true})
                    }}>
                        <Github/>
                    </button>
                    <button className={`svgButton toggable pin ${pinned ? 'active' : ''}`} onClick={e => {
                        setPinned(!pinned)
                    }}><Pin/></button>
                </div>
                {scale}
            </>
        )}
    </div>
}