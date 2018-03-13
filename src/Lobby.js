import React from 'react';
import { Link } from 'react-router-dom'

export const Lobby = () => (
    <div className = 'Lobby'> 
        <Link to = '/create'>Create New</Link>
        <Link to = '/join'>Join</Link>
    </div>
)