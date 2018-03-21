import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

export const FooterControls = props => {

    const secondsToMinutes = (time) => {
        const minutes = Math.floor( time / 60 )
        const seconds = time % 60
        return minutes + ':' + seconds
    }

    return (

        <div className = 'fixed-bottom'>
            <div className = 'spacer'>
                <Button
                    color = { props.isUserReady ? 'green' : 'blue' }
                    onClick = { props.toggleUserReady }
                    className = { props.isUserReady ? 'ready' : null }
                >
                { props.isUserReady ? 'Nicely done!' : "Next round!" }
                </Button>
                <span><strong>
                    { props.timeRemaining === 0 ? 
                        "Time's up!" : 
                        secondsToMinutes(props.timeRemaining) 
                    }
                </strong></span>
                <Button
                    loading = {props.isCurrentlySaving}
                    color = { props.isSaved ? 'green' : 'blue' }
                    onClick = { props.saveInputs }
                    className = { props.isSaved ? 'saved' : null }
                >
                <Icon name = 'save' />
                { props.isSaved ? 'Saved' : 'Save' }
                </Button>
            </div>
        </div>

    )
}
