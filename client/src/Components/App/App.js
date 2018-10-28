import React, { Component } from 'react';
import Chat from '../Chat/Chat';
import './App.css';
import ChooseName from '../ChooseName/ChooseName';
import ChooseType from '../ChooseType/ChooseType';
import Rooms from '../Rooms/Rooms';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      chatType: '',
      chatName: ''
    }
  }

  submitName = (username) => {
    this.setState({ username })
  };

  privateName = (name) => {
    this.setState({ chatName: name })
  };

  privateType = () => {
    this.setState({ chatType: 'private' })
  };

  publicType = () => {
    this.setState({ chatType: 'public' })
  };

  backToMain = () => {
    this.setState({ 
      chatType: '',
      chatName: ''
    })
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
          if (this.state.chatType === 'public') {
            return (
              <div className="App">
                  <Chat 
                    chatName="public-chat"
                    username={this.state.username}
                    secret_name='SeRvEr12St_%3+FX99#s#*s*MERCURy'
                    backToMain={this.backToMain}
                  />
              </div> 
            );
          } else {
              if (this.state.chatName === '') {
                return ( 
                  <div className="App">
                    <Rooms 
                      backToMain={this.backToMain}
                      privateName={this.privateName} 
                    />
                  </div>
                );
              } else {
                return (
                  <div className="App">
                      <Chat 
                        chatName={this.state.chatName}
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
  }
}

export default App;
