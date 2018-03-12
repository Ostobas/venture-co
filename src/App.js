import React, { Component } from 'react'
import { init as firebaseInit } from './firebase'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './Routes';

export default class App extends Component {
  constructor(props) {
    super(props)
    firebaseInit()
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </div>
    );
  }
}

