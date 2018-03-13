import React, { Component } from 'react'
import { init as firebaseInit } from './firebase'
import { BrowserRouter } from 'react-router-dom'
import { Routes } from './Routes';

export default class App extends Component {
  constructor(props) {
    super(props)
    firebaseInit()
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </div>
    )
  }
}

