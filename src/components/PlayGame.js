import React, { Component } from "react";

export class PlayGame extends Component {
    state = {
        price: 80
    }

    handleChange = ( event ) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return (
            <div className = 'PlayGame'> 
                <h1>Play game</h1>
                <div className="slidecontainer">
                    <div>Price</div>
                    <input
                        type = "range"
                        className = "Slider"
                        name = 'price'
                        min = '25'
                        max = '250'
                        value = { this.state.price }
                        onChange = { this.handleChange }/>
                    <div>Value: { this.state.price }</div>
                </div>
            </div>
        )
    }
}