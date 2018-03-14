import React from 'react'

import './Slider.css'

export const Slider = props => {

    return (
        <div className = 'Slider'>
        <div className = 'name'>{ props.name }</div>
        <div className = 'value'>
            <span>{Number( props.value ).toLocaleString()}</span>
            <span>{ props.unit }</span>
        </div>
        <input
            type = { props.type }
            name = { props.name }
            min = { props.min }
            max = { props.max }
            step = { props.step }
            value = { props.value }
            onChange = { props.change }
        />
        </div>
    )
}