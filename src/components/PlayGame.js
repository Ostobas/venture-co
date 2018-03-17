import React, { Component } from "react";
import { instance as axios } from '../axios'
import { Slider } from "./Slider";
import { Results } from "./Results";
import { Button, Container, Loader, Dimmer, Header, Icon, Dropdown, Divider, Menu } from 'semantic-ui-react'

export class PlayGame extends Component {
    state = {
        inputs: {},
        setup: {},
        isLoadingFinished: false,
        isSaved: true,
        isCurrentlySaving: false,
        isUserReady: false,
        error: {
            state: false,
            msg: ''
        }
    }

    componentDidMount () {
        const gameID = localStorage.getItem('gameID')
        const uri = 'games/' + gameID + '.json'
        axios.get(uri)
            .then(res => {
                const stateObj = {...this.state}
                stateObj.inputs = res.data.inputs[0]
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
        
            this.timer = setInterval(this.tick, 1000)
    }

    tick = () => {
        const oldTime = this.state.setup.roundTime
        if (oldTime <= 0) {
            clearInterval(this.timer)
            return
        }
        const setup = {...this.state.setup}
        setup.roundTime -= 1
        this.setState({
            setup: setup
        })
    }

    secondsToMinutes = (time) => {
        const minutes = Math.floor( time / 60 )
        const seconds = time % 60
        return minutes + ':' + seconds
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
        this.setState({
            isCurrentlySaving: true
        })

        const inputs = {...this.state.inputs}

        const gameID = localStorage.getItem('gameID')
        const period = 0
        const uri = 'games/' + gameID + '/inputs/' + period + '.json'

        axios.put(uri, inputs)
        .then(res => {
            this.setState({
                isSaved: true,
                isCurrentlySaving: false
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

    toggleUserReady = () => {
        this.setState({
            isUserReady: !this.state.isUserReady
        })
    }

    render() {

        let Controls = 
            <Dimmer active inverted>
                <Loader content = 'Loading' size = 'huge'/>
            </Dimmer>

        if (this.state.isLoadingFinished) {

            Controls = Object.keys(this.state.setup.inputs).map(key => {

                const inputSetup = {...this.state.setup.inputs[key]}

                return (
                    <Slider
                        key = { key }
                        type = { inputSetup.type }
                        name = { key }
                        realName = { inputSetup.realname }
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

        const friendOptions = [
            {
                text: 'Target Year',
                value: 'target'
            },
            {
                text: 'Last Year',
                value: 'last'
            },
            {
                text: 'History',
                value: 'history'
            },
            {
                text: 'Market Info',
                value: 'market'
            }
                
        ]
        
        return (
            <div className = 'PlayGame'> 

                <Menu inverted>
                    <Menu.Item header>Venture Co</Menu.Item>
                </Menu>

                <Container>

                    <div className = 'spacer'>
                        <Header as = 'h2' content = 'P&L' />
                        <Dropdown inline options={friendOptions} defaultValue={friendOptions[0].value} />
                    </div>
                    
                    {this.state.isLoadingFinished ? 
                        <Results
                            inputs = {this.state.inputs}
                            setup = { this.state.setup }
                        /> 
                        : null 
                    }
                    
                    <Divider />

                    <Header as = 'h2' content = 'Make your moves!' />
                    {Controls}

                    <div className = 'fixed-bottom'>
                        <div className = 'spacer'>
                            <Button
                                color = { this.state.isUserReady ? 'green' : 'blue' }
                                onClick = { this.toggleUserReady }
                                className = { this.state.isUserReady ? 'ready' : null }
                            >
                            { this.state.isUserReady ? 'Nicely done!' : "I'm ready" }
                            </Button>
                            <span><strong>
                                { this.state.setup.roundTime === 0 ? 
                                    "Time's up!" : 
                                    this.secondsToMinutes(this.state.setup.roundTime) 
                                }
                            </strong></span>
                            <Button
                                loading = {this.state.isCurrentlySaving}
                                color = { this.state.isSaved ? 'green' : 'blue' }
                                onClick = { this.saveInputs }
                                className = { this.state.isSaved ? 'saved' : null }
                            >
                            <Icon name = 'save' />
                            { this.state.isSaved ? 'Saved' : 'Save' }
                            </Button>
                        </div>
                    </div>

                </Container>
            </div>
        )
    }
}