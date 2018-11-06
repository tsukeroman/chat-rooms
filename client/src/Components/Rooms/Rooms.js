import React, { Component } from 'react';
import './Rooms.css';
import uuid from 'uuid';
import Room from '../Room/Room';
import PropTypes from 'prop-types';

/*
This component is responsible for viewing the available private rooms,
and also entering the rooms and creating new ones.
*/
class Rooms extends Component {
    static propTypes = {
        backToMain: PropTypes.func,
        privateName: PropTypes.func
      };  

    /*
    The state maintains the status of what the user want to do in Rooms,
    namely - do nothing (toRoom=''), create a new room (toRoom='create')
    or to enter an existing room (toRoom='enter').
    Also the state keeps an array of all the available room names, 
    a controlled state of the roomName and password for the input forms in
    create/enter room windows. 
    Additionally, the state keeps track of possible errors, such as 
    not-submitting required information, trying to create a room with the
    same name of an already existing one and trying to enter a room with a
    wrong password.
    */
    constructor(props) {
        super(props);
        this.state = {
            toRoom: '', // can be '', 'create' or 'enter'
            Rooms: [],
            roomName: '',
            password: '',
            noInfoErr: false,
            passErr: false,
            nameErr: false,
            existErr: false
        }
    }

    // Retrieves an updated list of rooms whenever the component mounts.
    componentDidMount() {
        this.getRooms();
    }

    /*
    Retrieves an updated list of rooms whenever the component recieves new
    props from it's parent.
    */
    componentWillReceiveProps() {
        this.getRooms();
    }

    /*
    This function is responsible for updating the state whenever a change
    occurs in one of the input forms. 
    After every change in the input it clears the errors that might have 
    occured previously.
    */
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

    /*
    This function is responsible to fetch an updated list of room names
    from the server.
    */
    getRooms = () => {
        fetch('/getRooms')
            .then(res => res.json())
            .then(res => this.setState({ Rooms: res.Rooms }))
    }

    /*
    This function is responsible for creating a new room.
    First, it checks whether the user entered a name and a password
    for the room, if not, an error is raised. Then, it talks to the 
    server, in order to check if there is no existing room with the 
    same name. If there is, it raises an error, otherwise, the room
    is being created.
    */
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

    /*
    This function is responsible for entering an existing room.
    It checks with the server whether the password the user submitted
    matches room's password. If yes, it proceeds to the chat. Otherwise,
    it raises an error. 
    One more possible scenario is that the room has been already deleted
    since all the users left it, in this case an error will be raised.
    */
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

    /*
    This function is responsible to take the user back to the main page
    of the App.
    */
    backToMain = () => {
        this.props.backToMain();
    }

    // Opens a window that allows to enter a room.
    openRoom = (roomName) => {
        this.setState({ toRoom: 'enter', roomName })
    }

    /*
    Here we use a conidtional rendering, according to the state.
    It depends on whether the user want to enter an existing room,
    to create a new one, or to not do anything at all.
    The list of the room as well as the side buttons are always rendered.
    */
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