import React, { Component } from 'react';
import Chat from '../Chat/Chat';
import './App.css';
import ChooseName from '../ChooseName/ChooseName';
import ChooseType from '../ChooseType/ChooseType';
import Rooms from '../Rooms/Rooms';

/*
This is the main component of the application. It is responsible for rendering 
the the components accordingly to application's state. 
*/

class App extends Component {
  /*
  The state maintains user's name, info about whether a user is in a chat room
  at the moment or not, and if he is, then in which chat.
  Also this component prevents a situation of two users with the same username
  particicating in the public chat, by updating state's publicNameErr value.
  */
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      chatType: '',
      chatName: '',
      publicNameErr: false
    }
  }

  // This function sets user's name to the state
  submitName = (username) => {
    this.setState({ username })
  };

  // This function sets private room's name to the state
  privateName = (name) => {
    this.setState({ chatName: name })
  };

  // This function updates the state in case the user decided to use the private rooms
  privateType = () => {
    this.setState({ chatType: 'private' })
  };

  /*
  This function updates the state in case the user decided to use the public chat,
  and it checks with the server whether there is no user with the same name using 
  the public chat. In case there is, it allows the user to choose a new username.
  */
  publicType = () => {
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
        if(res === true) {
          this.setState({
            chatType: '',
            username: '',
            publicNameErr: true 
          })
        } else {
          this.setState({ chatType: 'public' })
        }
      })
  };

  /*
  This function is responsible for updating the state in the case the user
  wants to come back to the main page, what causes App's re-render.
  */
  backToMain = () => {
    this.setState({ 
      chatType: '',
      chatName: ''
    })
  }

  /*
  Here we use a conidtional rendering, according to the state.
  It depends on:
  1) whether the user chose a username
  2) whether the user want to use the public chat or a private room
  3) in case the user uses a private room, what room he uses
  */
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
