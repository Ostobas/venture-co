import React, { Component } from "react";
import axios from 'axios'
import { Slider } from "./Slider";

export class PlayGame extends Component {
    state = {
        inputs: {},
        results: {
            revenue: 0,
            cog: 0,
            grossProfit: 0,
            expenses: 0,
            netProfit: 0,
            ror: 0
        },
        isLoadingFinished: false,
        isSaved: true,
        isUserReady: false,
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
                    isLoadingFinished: true
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
        updatedInputs[name].value = Number(event.target.value)

        this.setState({
             inputs: updatedInputs,
             isSaved: false
        })
    }

    saveInputs = () => {
        const inputs = {...this.state.inputs}

        axios.put('https://venture-co.firebaseio.com/inputs.json', inputs)
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

    getRevenue = () => {
        if (!this.state.isLoadingFinished) return
        const results = {...this.state.results}
        results.revenue = this.state.inputs.price.value * this.state.inputs.sales.value

        this.setState({
            results: results
        })
    }

    getCoGs = () => {
        if (!this.state.isLoadingFinished) return
        return (
            (this.state.inputs.price.value * this.state.inputs.sales.value).toLocaleString()
        )
    }

    render() {

        let Controls = 'Loading...'
        let Results = null

        if (this.state.isLoadingFinished) {

            Controls = Object.keys(this.state.inputs).map(key => {

                const input = {...this.state.inputs[key]}

                return (
                    <Slider
                        type = { input.type }
                        name = { key }
                        unit = { input.unit }
                        key = { key }
                        min = { input.min }
                        max = { input.max }
                        step = { input.step }
                        value = { input.value }
                        change = { this.handleChange }
                    />
                )
            })

            Results = () => (
                <section>
                    <div>Target Revenue:<span>$</span></div>
                    <div>Cost of Goods:<span>$</span></div>
                    <div>Gross Profit:<span> $</span></div>
                    <div>Expenses:<span> $</span></div>
                    <div>Net Profit:<span> $</span></div>
                    <div>Return on Revenue:<span> %</span></div>
                </section>
            )
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
                {Results}
                <section>{Controls}</section>
            </div>
        )
    }
}