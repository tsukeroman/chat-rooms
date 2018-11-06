import React, { Component } from 'react';
import './Rooms.css';
import uuid from 'uuid';
import Room from '../Room/Room';
import PropTypes from 'prop-types';

class Rooms extends Component {
    static propTypes = {
        backToMain: PropTypes.func,
        privateName: PropTypes.func
      };  

    constructor(props) {
        super(props);

    this.state = {
        toRoom: '',
        roomName: '',
        Rooms: [],
        password: '',
        noInfoErr: false,
        passErr: false,
        nameErr: false,
        existErr: false
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
            this.setState({ 
                roomName: event.target.value,
                existErr: false,
                noInfoErr: false
            })
      } else {
          if (event.target.name === "password") {
            this.setState({ 
                password: event.target.value, 
                passErr: false,
                noInfoErr: false
            })
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
            .then(res => {
                if(res) {
                    this.props.privateName(this.state.roomName);
                    this.setState({ 
                        Rooms: res.Rooms,
                        toRoom: '',
                        roomName: '',
                        password: '',
                        nameErr: false
                    }) 
                } else {
                    this.getRooms();
                    this.setState({ 
                        roomName: '',
                        password: '',
                        nameErr: true
                    }) 
                }
            })
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
            if (res.success === 'Ok') {
                this.props.privateName(this.state.roomName);
            } else {
                if (res.success === 'wrongPassword') {
                    this.setState({
                        passErr: true
                    })
                } else {
                    this.setState({
                        existErr: true
                    })
                }
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
                                placeholder="Write room's name here"
                                type="text" 
                                value={this.state.roomName}
                                name="roomName"
                                onChange={this.handleInputChange} 
                            />
                            <br />
                            <input 
                                placeholder="Choose a password"
                                type="password" 
                                value={this.state.password}
                                name="password"
                                onChange={this.handleInputChange} 
                            />
                            <br />
                            {this.state.noInfoErr ? 
                                <div className="Err">Submit room name and password</div>
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
                                        noInfoErr: false,
                                        nameErr: false
                                    }, event.preventDefault())}
                                }
                            >
                                Cancel
                            </button>
                            
                        </form>
                        {this.state.nameErr ?
                            <div className="Err">
                                A room with this name is already exist,
                                <br />
                                please choose another name.
                            </div>
                            :
                            null
                        }
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
                                placeholder="Enter your password..."
                                type="password" 
                                value={this.state.password}
                                name="password"
                                onChange={this.handleInputChange} 
                            />
                            <br />
                            <input type="submit" value="Enter" />
                            <button 
                                onClick={(event) => {
                                    this.getRooms();
                                    this.setState({ 
                                        toRoom: '',
                                        roomName: '',
                                        password: '', 
                                        passErr: false,
                                        existErr: false
                                    }, event.preventDefault());
                                }
                                }
                            >
                                Cancel
                            </button>
                        </form>
                        {this.state.passErr ?
                            <div className="Err">
                                The password is incorrect
                            </div>
                            :
                            null
                        }
                        {this.state.existErr ?
                            <div className="Err">
                                This room doesn't exist any more.
                            </div>
                            :
                            null
                        }
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