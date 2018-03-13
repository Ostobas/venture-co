import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { Lobby } from './Lobby';
import { CreateGame } from './CreateGame'
import { JoinGame } from './JoinGame'


export const Routes = () => (
    <Switch>
        <Route path = '/' exact component = {Lobby} />
        <Route path = '/create' exact component = {CreateGame} />
        <Route path = '/join' exact component = {JoinGame} />
    </Switch>
)