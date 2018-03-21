import React, { Component } from 'react'
import { instance as axios } from '../axios'
import { Slider } from './Slider'
import { Results } from './Results'
import { FooterControls } from './FooterControls'
import { Container, Loader, Dimmer, Header, Divider, Menu } from 'semantic-ui-react'

export class PlayGame extends Component {
    state = {
        inputs: {},
        isLoadingFinished: false,
        isSaved: true,
        isCurrentlySaving: false,
        isUserReady: false,
        timeRemaining: 60,
        period: 1,
        historyPeriod: 0,
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
                this.setup = res.data.setup
                this.setup.createdBy = res.data.createdBy

                const stateObj = {...this.state}
                stateObj.inputs = res.data.inputs[period]
                

                const now = new Date().getTime()
                const passedTime = Math.round((now - Date.parse(res.data.createdInTime)) / 1000)
                stateObj.timeRemaining = Math.max(this.setup.roundTime - passedTime, 0)
                
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

    handleChange = ( event ) => {
        const name = event.target.name
        const updatedInputs = {...this.state.inputs}
        updatedInputs[name] = Number(event.target.value)

        this.setState({
             inputs: updatedInputs,
             isSaved: false
        })
    }

    changeHistory = ( event ) => {
        this.setState({
            historyPeriod: Number(event.target.value)
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
            isUserReady: !this.state.isUserReady,
        })
    }

    render() {

        if (!this.state.isLoadingFinished)
            return (
                <Dimmer active inverted>
                    <Loader content = 'Loading' size = 'huge'/>
                </Dimmer>
            )

        const Controls = Object.keys(this.setup.inputs).map(key => {

            const inputSetup = {...this.setup.inputs[key]}

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
        
        return (
            <div className = 'PlayGame'> 

                <Menu inverted>
                    <Menu.Item header>Venture Co</Menu.Item>
                    <Menu.Menu position = 'right'>
                        <Menu.Item header>Round: {this.state.period}</Menu.Item>
                        <Menu.Item header>{this.setup.createdBy}</Menu.Item>
                    </Menu.Menu>
                </Menu>

                <Container>

                    {/* <div className = 'spacer'>
                        <Header as = 'h2' content = 'P&L' />
                        <span><strong>Target Year</strong></span>
                    </div> */}

                    <div className = 'spacer'>
                        <Header as = 'h2' content = 'History' />
                        <span><strong>Round: {this.state.historyPeriod}</strong></span>
                    </div>
                    
                    {/* {this.state.isLoadingFinished ?  */}
                        <Results inputs = {this.state.inputs} /> 
                        {/* : null 
                    } */}
                    
                    <Divider />

                    {/* <Header as = 'h2' content = 'Make your moves!' />
                    {Controls} */}

                    <div className = 'spacer'>Price
                        <span>{ this.state.inputs.price.toLocaleString() } $</span>
                    </div>
                    <div className = 'spacer'>Promotion
                        <span>{ this.state.inputs.promotion.toLocaleString() } $</span>
                    </div>
                    <div className = 'spacer'>Quality
                        <span>{ this.state.inputs.quality.toLocaleString() } %</span>
                    </div>
                    <div className = 'spacer'>Sales
                        <span>{ this.state.inputs.sales.toLocaleString() } unit</span>
                    </div>

                    <Header as = 'h2' content = 'You can choose a round!' />

                    <Slider
                        type = 'range'
                        name = 'round'
                        realName = 'Round'
                        unit = ''
                        min = { 0 }
                        max = { 5 }
                        step = { 1 }
                        value = { this.state.historyPeriod }
                        change = { this.changeHistory }
                    />


                    <FooterControls 
                        isUserReady = { this.state.isUserReady }
                        toggleUserReady = { this.toggleUserReady }
                        timeRemaining = { this.state.timeRemaining }
                        isCurrentlySaving = { this.state.isCurrentlySaving }
                        isSaved = { this.state.isSaved }
                        saveInputs = { this.saveInputs }
                    />

                </Container>
            </div>
        )
    }
}