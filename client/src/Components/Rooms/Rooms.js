import React, { Component } from 'react';
import './Rooms.css';
import uuid from 'uuid';
import Room from '../Room/Room';

class Rooms extends Component {
  constructor(props) {
    super(props);

    this.state = {
        toRoom: '',
        roomName: '',
        Rooms: [],
        password: '',
        noInfoErr: false
    }
  }

  componentDidMount() {
    this.getRooms();
  }

  componentWillReceiveProps() {
      this.getRooms();
  }

  handleInputChange = (event) => {
      if (event.target.name === "roomName") {
          this.setState({ roomName: event.target.value })
      } else {
          if (event.target.name === "password") {
              this.setState({ password: event.target.value })
          }
      }
  }

  getRooms = () => {
      fetch('/getRooms')
        .then(res => res.json())
        .then(res => this.setState({ Rooms: res.Rooms }))
  }

  createRoom = (event) => {
    event.preventDefault();
    //console.log(this.statevent.preventDefault();e.roomName);

    if (this.state.roomName === '' || this.state.password === '') {
        this.setState({ noInfoErr: true });
        return;
    } else {
        fetch('/newRoom', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                roomName: this.state.roomName, 
                password: this.state.password 
            })
        })
            .then(res => res.json())
            .then(res => this.setState({ 
                Rooms: res.Rooms,
                toRoom: '',
                roomName: '',
                password: ''
            }));
    }  
  }

  enterRoom = (event) => {
    event.preventDefault();
    fetch('/enterRoom', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            roomName: this.state.roomName, 
            password: this.state.password 
        })
    })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                console.log('Connected :P');
                this.props.privateName(this.state.roomName);
            } else {
                console.log('Wrong password :/');
                this.setState({
                    toRoom: '',
                    roomName: '',
                    password: ''
                })
            }
        })

  }

  backToMain = () => {
    this.props.backToMain();
  }

  openRoom = (roomName) => {
    this.setState({ toRoom: 'enter', roomName })
  }

  render() {
    let proceed;
    if (this.state.toRoom === '') {
        proceed = null;
    } else {
        if (this.state.toRoom === 'create') {
            proceed = (
                <div className="ProceedToRoom">
                    <div className="ProceedContent">
                        CREATE ROOM
                        <form onSubmit={this.createRoom}>
                            <input 
                                type="text" 
                                value={this.state.roomName}
                                name="roomName"
                                onChange={this.handleInputChange} 
                            />
                            <br />
                            <input 
                                type="password" 
                                value={this.state.password}
                                name="password"
                                onChange={this.handleInputChange} 
                            />
                            <br />
                            {this.state.noInfoErr ? 
                                <div className="infoErr">Submit room name and password</div>
                                :
                                <div></div>    
                            }
                            <input type="submit" value="Create" />
                            <button 
                                onClick={(event) => {
                                    this.setState({ 
                                        toRoom: '',
                                        roomName: '',
                                        password: '', 
                                        noInfoErr: false
                                    }, event.preventDefault())}
                                }
                            >
                                Cancel
                            </button>
                            
                        </form>
                    </div>
                </div>
            );
        } else {
            proceed = (
                <div className="ProceedToRoom">
                    <div className="ProceedContent">
                        <form onSubmit={this.enterRoom}>
                            <p>{this.state.roomName}</p>
                            <input 
                                type="password" 
                                value={this.state.password}
                                name="password"
                                onChange={this.handleInputChange} 
                            />
                            <br />
                            <input type="submit" value="Enter" />
                            <button 
                                onClick={(event) => this.setState({ 
                                    toRoom: '',
                                    roomName: '',
                                    password: '', 
                                }, event.preventDefault())}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            );
        }
    }
    return (
        <div className="Rooms">               
            {proceed}
            <div className="CreateRoom">
                <button 
                    className="RoomsButton"
                    onClick={() => this.setState({ toRoom: 'create' })}
                >
                    Create Room
                </button>
                <br />
                <button 
                    className="RoomsButton"
                    onClick={this.getRooms}
                >
                    Refresh Rooms
                </button>
                <br />
                <button className="RoomsButton" onClick={this.backToMain}>
                    Back to main
                </button>
            </div>
            <div className="ChooseRoom">
                <br />
                {this.state.Rooms.map(item => 
                    <Room 
                        key={uuid.v4()}
                        openRoom={this.openRoom} 
                        roomName={item} 
                    />
                )}
            </div>
        </div>
    );
  }
}
  
  export default Rooms;