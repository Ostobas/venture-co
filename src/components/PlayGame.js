import React, { Component } from "react";
import axios from 'axios'
import { Slider } from "./Slider";
import { Results } from "./Results";

export class PlayGame extends Component {
    state = {
        inputs: {},
        setup: {},
        isLoadingFinished: false,
        isSaved: true,
        isUserReady: false,
        error: {
            state: false,
            msg: ''
        }
    }

    componentDidMount () {
        axios.get('https://venture-co.firebaseio.com/game.json')
            .then(res => {
                const stateObj = {...this.state}
                stateObj.inputs = res.data.inputs
                stateObj.setup = res.data.setup
                stateObj.isLoadingFinished = true
                this.setState(stateObj)
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
        updatedInputs[name] = Number(event.target.value)

        this.setState({
             inputs: updatedInputs,
             isSaved: false
        })
    }

    saveInputs = () => {
        const inputs = {...this.state.inputs}

        axios.put('https://venture-co.firebaseio.com/game/inputs.json', inputs)
        .then(res => {
            this.setState({
                isSaved: true
           })
           alert('Decision saved!')
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

    toggleUserReady = () => {
        this.setState({
            isUserReady: !this.state.isUserReady
        })
    }

    render() {

        let Controls = 'Loading...'

        if (this.state.isLoadingFinished) {

            Controls = Object.keys(this.state.setup.inputs).map(key => {

                const inputSetup = {...this.state.setup.inputs[key]}

                return (
                    <Slider
                        key = { key }
                        type = { inputSetup.type }
                        name = { key }
                        realName = { inputSetup.name }
                        unit = { inputSetup.unit }
                        min = { inputSetup.min }
                        max = { inputSetup.max }
                        step = { inputSetup.step }
                        value = { this.state.inputs[key] }
                        change = { this.handleChange }
                    />
                )
            })        
        }
        
        return (
            <div className = 'PlayGame'> 
                <h1>Venture Co - header</h1>

                <nav>
                    <button
                        onClick = { this.saveInputs }
                        className = { this.state.isSaved ? 'saved' : null }
                    >Save
                    </button>
                    <button
                        onClick = { this.toggleUserReady }
                        className = { this.state.isUserReady ? 'ready' : null }
                    >I'm ready
                    </button>
                </nav>

                {this.state.isLoadingFinished ? 
                    <Results inputs = {this.state.inputs} setup = { this.state.setup } /> 
                    : null 
                }
                <section>{Controls}</section>
            </div>
        )
    }
}