import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { Lobby } from './components/Lobby';
import { CreateGame } from './components/CreateGame'
import { JoinGame } from './components/JoinGame'
import { PlayGame } from './components/PlayGame'

export const Routes = () => (
    <Switch>
        <Route path = '/' exact component = {Lobby} />
        <Route path = '/create' exact component = {CreateGame} />
        <Route path = '/join' exact component = {JoinGame} />
        <Route path = '/play/:id' component = {PlayGame} />
        <Route path = '/' render={() => 404} />
    </Switch>
)