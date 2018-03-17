import React, { Component } from 'react';
import { instance as axios } from '../axios'
import { Button, Menu, Header, Container, Divider, Input, Message } from 'semantic-ui-react'
import { Slider } from './Slider';
import gameSetup from '../gameSetup.json'

export class CreateGame extends Component {

    state = {
        userName: '',
        isValidUsername: true,
        rounds: 4,
        roundTime: 3,
        teams: 5
    }

    handleChange = ( event ) => {
        const name = event.target.name
        this.setState({
             [name]: Number(event.target.value)
        })
    }

    handleTextChange = ( event ) => {
        this.setState({
            userName: event.target.value
        })
    }

    createNewGame = () => {
        if (!this.validateUsername())  return

        const gameObj = gameSetup
        gameObj.setup.roundsTotal = this.state.rounds
        gameObj.setup.roundTime = this.state.roundTime * 60
        gameObj.setup.teamsTotal = this.state.teams
        gameObj.createdBy = this.state.userName
        gameObj.createdInTime = new Date()
        gameObj.code = this.generateCode(6)

        gameObj.setup.demands = []
        gameObj.inputs = []
        for ( let i = 0; i <= gameObj.setup.roundsTotal; i++ ) {
            gameObj.setup.demands.push( gameObj.setup.baseDemand *  gameObj.setup.teamsTotal )
            gameObj.inputs.push( gameObj.defaultInputs )
        }

        axios.post('games.json', gameObj)
        .then(res => {
            const gameID = res.data.name
            localStorage.setItem('gameID', gameID)
            this.props.history.push('/play/' + gameObj.code)
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

    validateUsername = () => {
        const min = 3
        const max = 10
        const userName = this.state.userName

        if (userName.length < min || userName.length > max) {
            this.setState({
                isValidUsername: false
            })
            return false
        }

        return true
    }

    generateCode = (length) => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
        let code = ''
        for ( let i = 0; i < length; i++ ) {
            code += alphabet[ Math.floor( Math.random() * alphabet.length ) ]
        }
        return code
    }

    render() {
        
        return (
            <div className = 'CreateGame'> 

                <Menu inverted>
                    <Menu.Item header>Venture Co</Menu.Item>
                </Menu>

                <Container>
                    <Header as = 'h2' content = 'Creating a game' />

                    <Input fluid autoFocus
                        size = 'large'
                        icon = 'user' iconPosition = 'left'
                        placeholder = 'Username'
                        value = { this.state.userName }
                        onChange = { this.handleTextChange }
                    />

                    <Message negative hidden = { this.state.isValidUsername } >
                        <Message.Header>Invalid uername!</Message.Header>
                        <p>Username must be a minimum of 3 and a maximum of 10 characters.</p>
                    </Message>

                    <Divider />

                    <Header as = 'h2' content = 'Game settings' />

                    <Slider
                        type = 'range'
                        name = 'rounds'
                        realName = 'Number of Rounds'
                        unit = ''
                        min = { 2 }
                        max = { 10 }
                        step = { 1 }
                        value = { this.state.rounds }
                        change = { this.handleChange }
                    />

                    <Slider
                        type = 'range'
                        name = 'roundTime'
                        realName = 'Time per Round'
                        unit = 'minutes'
                        min = { 1 }
                        max = { 30 }
                        step = { 1 }
                        value = { this.state.roundTime }
                        change = { this.handleChange }
                    />

                    <Slider
                        type = 'range'
                        name = 'teams'
                        realName = 'Number of Teams'
                        unit = ''
                        min = { 2 }
                        max = { 10 }
                        step = { 1 }
                        value = { this.state.teams }
                        change = { this.handleChange }
                    />
            
                    <div className = 'fixed-bottom'>
                        <div className = 'spacer'>
                            <Button
                                onClick = { () => this.props.history.push('/') }
                            >
                            Cancel
                            </Button>
                            <Button
                                color = 'green'
                                onClick = { this.createNewGame }
                            >
                            Create new
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

}
