import React, { Component } from "react";
import axios from 'axios'
import { Slider } from "./Slider";

export class PlayGame extends Component {
    state = {
        inputs: {},
        isReady: false,
        error: {
            state: false,
            msg: ''
        }
    }

    componentDidMount () {
        axios.get('https://venture-co.firebaseio.com/inputs.json')
            .then(res => {
                this.setState({
                    inputs: res.data,
                    isReady: true
                })
            })
            .catch(err => {
                this.setState({
                    error: {
                        state: true,
                        msg: err
                    }
                })
            })
    }

    handleChange = ( event ) => {
        const name = event.target.name
        const updatedInputs = {...this.state.inputs}
        updatedInputs[name].value = event.target.value
        this.setState({
             inputs: updatedInputs
        })
    }

    render() {

        let Controls = 'Loading...'

        if (this.state.isReady) {

            Controls = Object.keys(this.state.inputs).map(key => {

                const inputName = key
                const input = this.state.inputs[inputName]

                return (
                    <Slider
                        type = { input.type }
                        name = { inputName }
                        unit = { input.unit }
                        key = { inputName }
                        min = { input.min }
                        max = { input.max }
                        step = { input.step }
                        value = { input.value }
                        change = { this.handleChange }
                    />
                )
            })
        }

        return (
            <div className = 'PlayGame'> 
                <h1>Play game</h1>
                {Controls}
            </div>
        )
    }
}