import React from 'react';
import { Link } from 'react-router-dom'
import './Lobby.css'

export const Lobby = () => (



    <div className = 'Lobby'> 
        <Link className='Link' to = '/create'>Create New</Link>
        {/* <Link className='Link' to = '/join'>Join</Link> */}
    </div>
)