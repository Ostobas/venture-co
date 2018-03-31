import React, { Component } from 'react'
import { instance as axios } from '../axios'
import { Slider } from './Slider'
import { Results } from './Results'
import { FooterControls } from './FooterControls'
import { Container, Loader, Dimmer, Header, Divider, Menu, Button } from 'semantic-ui-react'
import { marketModel } from './marketModel';

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
        view: 'target',
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
                this.setup = res.data.setup
                this.setup.createdBy = res.data.createdBy

                const stateObj = {...this.state}
                stateObj.inputs = res.data.inputs
                

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
        const period = this.state.period
        const name = event.target.name
        const updatedInputs = {...this.state.inputs}
        updatedInputs[period][name] = Number(event.target.value)

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

        const gameID = localStorage.getItem('gameID')
        const period = this.state.period
        const inputs = {...this.state.inputs[period]}
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

    nextRound = () => {

        let period = this.state.period

        this.setState({
            isLoadingFinished: false
        })

        this.getInputs().then(resolve => {
            console.log('[Inputs]',resolve)
            return marketModel.getSales(resolve.inputs, resolve.demand)
        })
        .then(sales => {
            console.log('[Sales]',sales)
            period = Math.min(period + 1, this.setup.roundsTotal)
            this.setState({
                isLoadingFinished: true,
                view: 'history',
                period: period,
                historyPeriod: period - 1
            })
        })
    }

    getInputs = () => new Promise ((resolve, reject) => {

        const period = this.state.period
        const gameID = localStorage.getItem('gameID')
        const uri = 'games/' + gameID + '.json'
        axios.get(uri)
            .then(res => {
                const playerInputs = res.data.inputs[period]
                const defaultInputs = res.data.defaultInputs
                const teamsTotal = res.data.setup.teamsTotal
                const demand = res.data.setup.demands[period]
                let inputs = {
                    price: [], promotion: [], quality: []
                }

                for (let i = 0; i < teamsTotal; i++) {
                    for (const inputType in inputs) {
                        if (i === 0)
                            inputs[inputType].push(playerInputs[inputType])
                        else 
                            inputs[inputType].push(defaultInputs[inputType])
                    }
                }

                resolve({
                    inputs: inputs,
                    demand: demand
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
    })

    toggleView = () => {
        if (this.state.view === 'target') {
            this.setState({
                view: 'history'
            })
        } else {
            this.setState({
                view: 'target'
            })
        }
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
                    value = { this.state.inputs[this.state.period][key] }
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

                    <div className = 'spacer'>
                        <Header as = 'h2' 
                            content = { this.state.view === 'target' ? 'P&L' : 'History' } />
                        <span><strong>
                            { this.state.view === 'target' ? 
                            'Target Year' : (
                                'Round: ' + this.state.historyPeriod
                            )}
                        </strong></span>
                    </div>
                    
                    {this.state.view === 'target' ? 
                        <Results inputs = {this.state.inputs[this.state.period]} /> :
                        <Results inputs = {this.state.inputs[this.state.historyPeriod]} />
                    }
                    
                    <Divider />

                    
                    {this.state.view === 'target' ? 
                    (
                        <Header as = 'h2' content = 'Make your moves!' />
                        , Controls
                    ) :
                    (<div>
                        <div className = 'spacer'>Price
                            <span>{ this.state.inputs[this.state.historyPeriod].price.toLocaleString() } $</span>
                        </div>
                        <div className = 'spacer'>Promotion
                            <span>{ this.state.inputs[this.state.historyPeriod].promotion.toLocaleString() } $</span>
                        </div>
                        <div className = 'spacer'>Quality
                            <span>{ this.state.inputs[this.state.historyPeriod].quality.toLocaleString() } %</span>
                        </div>
                        <div className = 'spacer'>Sales Estimation
                            <span>{ this.state.inputs[this.state.historyPeriod].sales.toLocaleString() } unit</span>
                        </div>
                        <div className = 'spacer'>Actual Sales
                            <span>{ this.state.inputs[this.state.historyPeriod].sales.toLocaleString() } unit</span>
                        </div>
    
                        <Header as = 'h2' content = 'You can choose a round!' />
    
                        <Slider
                            type = 'range'
                            name = 'round'
                            realName = 'Round'
                            unit = ''
                            min = { 0 }
                            max = { this.state.period - 1 }
                            step = { 1 }
                            value = { this.state.historyPeriod }
                            change = { this.changeHistory }
                        />
                        </div>
                    )}

                    <Button primary onClick = { this.toggleView }>
                    Change View
                    </Button>

                    <FooterControls 
                        isUserReady = { this.state.isUserReady }
                        nextRound = { this.nextRound }
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