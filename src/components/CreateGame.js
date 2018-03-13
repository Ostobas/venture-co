import React from "react";

export const CreateGame = (props) => (

    <div className = 'CreateGame'> 
        <div>Create New Game</div>
        <button 
            disabled = {false}
            onClick={() => props.history.push('/play/id')}>
            Create
        </button>
    </div>
)