import { ReactElement } from 'react'
import './Option.css'

type OptionProps = {
    label: string,
    tooltip?: string,
    children?: ReactElement
}

export function Option(props: OptionProps) {
    return <div className="Option">
        <div className="display">
            <div className="label">{props.label}</div>
            {props.tooltip && (
                <div className="context">{props.tooltip}</div>
            )} 
        </div>
        {props.children}
    </div>
}