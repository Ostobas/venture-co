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
        timeRemaining: 60,
        period: 0,
        createdBy: '',
        error: {
            state: false,
            msg: ''
        }
    }

    componentDidMount () {
        const period = this.state.period
        const gameID = localStorage.getItem('gameID')
        const uri = 'games/' + gameID + '.json'
        axios.get(uri)
            .then(res => {
                const stateObj = {...this.state}
                stateObj.inputs = res.data.inputs[period]
                stateObj.setup = res.data.setup
                stateObj.createdBy = res.data.createdBy

                const now = new Date().getTime()
                const passedTime = Math.round((now - Date.parse(res.data.createdInTime)) / 1000)
                stateObj.timeRemaining = Math.max(res.data.setup.roundTime - passedTime, 0)
                
                stateObj.isLoadingFinished = true
                this.setState(stateObj)

                this.timer = setInterval(this.tick, 1000)
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

    tick = () => {
        let oldTime = this.state.timeRemaining
        if (oldTime <= 0) {
            clearInterval(this.timer)
            return
        }
        oldTime -= 1
        this.setState({
            timeRemaining: oldTime
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
        const period = this.state.period
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

    handleDismiss = () => {
        return true
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
                    <Menu.Menu position = 'right'>
                        <Menu.Item header>Round: {this.state.period}</Menu.Item>
                        <Menu.Item header>{this.state.createdBy}</Menu.Item>
                    </Menu.Menu>
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
                                { this.state.timeRemaining === 0 ? 
                                    "Time's up!" : 
                                    this.secondsToMinutes(this.state.timeRemaining) 
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