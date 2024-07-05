import { Reset } from "./Reset"
import "./ColorWell.css"

type ColorWellProps = {
    color: string,
    onChange: (newColor: string) => void,
    isActive?: boolean,
    onReset?: () => void 
}

export function ColorWell(props: ColorWellProps) {
    return <div className="ColorWell">
        <Reset active={props.isActive} onClick={() => {
            props.onReset?.()
        }}/>
        <input value={props.color} type="color" onChange={e => {
            props.onChange(e.target.value)
        }}/>
    </div>
}