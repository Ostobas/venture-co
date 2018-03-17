import React from 'react';
import { Link } from 'react-router-dom'
import './Main.css'

export const Main = () => (



    <div className = 'Main'> 
        <Link className='Link' to = '/create'>New game</Link>
        {/* <Link className='Link' to = '/join'>Join</Link> */}
    </div>
)