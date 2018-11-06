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
      chatName: '',
      publicNameErr: false
    }
  }

  existInRoom = (username, chatname) => {
    
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
    console.log('ENTERED');

    fetch('/userExist', {
      method: 'post',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
          username: this.state.username,
          chatname: 'public-chat'
      })
    })
      .then(res => res.json())
      .then(res => {
        console.log(`res is ${res}`);
        if(res === true) {
          console.log('already exist');
          this.setState({
            chatType: '',
            username: '',
            publicNameErr: true 
          })
        } else {
          console.log('doesnt exist');
          this.setState({ chatType: 'public' })
        }
      })
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
          { this.state.publicNameErr ?
              <div className="takenErr">
                There is already a user with the same name your
                in the public chat room.
                <br />
                Please chose another name if you want to enter 
                the public chat.
              </div> 
              :
              null
          }
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
