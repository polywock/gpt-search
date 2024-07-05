
import * as React from "react"

type SvgPropsBase = {
    width?: React.SVGAttributes<SVGElement>["width"],
    height?: React.SVGAttributes<SVGElement>["height"],
    style?: React.SVGAttributes<SVGElement>["style"],
    className?: React.SVGAttributes<SVGElement>["className"],
    color?: React.SVGAttributes<SVGElement>["color"]
}

export type SvgProps = SvgPropsBase & {
    size?: number | string,
    onClick?: (e: React.MouseEvent) => void 
}

function prepareProps(props: SvgProps) {
    props = { ...(props ?? {}) }
    props.width = props.width ?? props.size ?? "1em"
    props.height = props.height ?? props.size ?? "1em"

    delete props.size
    return props as SvgPropsBase
}


export function Gear(props: SvgProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={0}
            viewBox="0 0 14 16"
            {...(prepareProps(props))}
        >
            <path
                fillRule="evenodd"
                stroke="none"
                d="M14 8.77v-1.6l-1.94-.64-.45-1.09.88-1.84-1.13-1.13-1.81.91-1.09-.45-.69-1.92h-1.6l-.63 1.94-1.11.45-1.84-.88-1.13 1.13.91 1.81-.45 1.09L0 7.23v1.59l1.94.64.45 1.09-.88 1.84 1.13 1.13 1.81-.91 1.09.45.69 1.92h1.59l.63-1.94 1.11-.45 1.84.88 1.13-1.13-.92-1.81.47-1.09L14 8.75v.02zM7 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
            />
        </svg>
    )
}

export function Github(props: SvgProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={0}
            viewBox="0 0 16 16"
            {...props}
        >
            <path
                fillRule="evenodd"
                stroke="none"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            />
        </svg>
    )
}

export function Star(props: SvgProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={0}
            viewBox="0 0 576 512"
            {...props}
        >
            <path
                stroke="none"
                d="M259.3 17.8 194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
            />
        </svg>
    )
}

export function Heart(props: SvgProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={0}
            viewBox="0 0 512 512"
            {...props}
        >
            <path
                stroke="none"
                d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"
            />
        </svg>
    )
}

export function Pin(props: SvgProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={0}
            viewBox="0 0 16 16"
            {...props}
        >
            <path
            stroke="none"
            d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354z"
            />
        </svg>
    )
}

export function Diamond(props: SvgProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={0}
            viewBox="0 0 512 512"
            {...props}
        >
            <path
            stroke="none"
            d="M284.3 11.7c-15.6-15.6-40.9-15.6-56.6 0l-216 216c-15.6 15.6-15.6 40.9 0 56.6l216 216c15.6 15.6 40.9 15.6 56.6 0l216-216c15.6-15.6 15.6-40.9 0-56.6l-216-216z"
            />
        </svg>
    )
}


export function Close(props: SvgProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={0}
            viewBox="0 0 24 24"
            {...props}
        >
            <path fill="none" stroke="none" d="M0 0h24v24H0z" />
            <path
            stroke="none"
            d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
        </svg>
    )
}

export function SearchSvg(props: SvgProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width='1em'
            height='1em'
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            {...props}
        >
            <circle cx={11} cy={11} r={8} />
            <path d="m21 21-4.35-4.35" />
        </svg>
    )
}

export function ResetSvg(props: SvgProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={0}
            className="reset active"
            viewBox="0 0 512 512"
            {...props}
        >
            <path
            stroke="none"
            d="M248.91 50a205.9 205.9 0 0 1 35.857 3.13c85.207 15.025 152.077 81.895 167.102 167.102 15.023 85.208-24.944 170.917-99.874 214.178-32.782 18.927-69.254 27.996-105.463 27.553-46.555-.57-92.675-16.865-129.957-48.15l30.855-36.768a157.846 157.846 0 0 0 180.566 15.797 157.846 157.846 0 0 0 76.603-164.274A157.848 157.848 0 0 0 276.429 100.4a157.84 157.84 0 0 0-139.17 43.862L185 192H57V64l46.34 46.342C141.758 71.962 194.17 50.03 248.91 50z"
            />
        </svg>
    )
}