import React, { Component } from 'react';
import Chat from '../Chat/Chat';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Chat username='user01' />
      </div>
    );
  }
}

export default App;
