import React, { Component } from 'react';
import Chat from '../Chat/Chat';
import './App.css';
import ChooseName from '../ChooseName/ChooseName';
import ChooseType from '../ChooseType/ChooseType';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      chatType: ''
    }
  }

  submitName = (username) => {
    this.setState({ username })
  };

  privateType = () => {
    this.setState({ chatType: 'private' })
  };

  publicType = () => {
    this.setState({ chatType: 'public' })
  };

  backToMain = () => {
    this.setState({ chatType: '' })
  }

  render() {
    if (this.state.username === '') {
      return (
        <div className="App">
          <ChooseName submitName={this.submitName} />
        </div>
      );
    } else {
        if (this.state.chatType === '') {
          return ( 
            <div className="App">
                <ChooseType onPrivate={this.privateType} onPublic={this.publicType} />
            </div>
          );
        } else {
          return ( 
            <div className="App">
                <Chat 
                  username={this.state.username}
                  secret_name='SeRvEr12St_%3+FX99#s#*s*MERCURy'
                  backToMain={this.backToMain}
                />
            </div>
          );
        }
      }
  }
}

export default App;
