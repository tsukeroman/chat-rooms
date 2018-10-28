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
        Rooms: ['Room1', 'Room2', 'Room3']
    }
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
                        <form>
                            <input type="text" />
                            <br />
                            <input type="password" />
                            <br />
                            <input type="submit" value="Create" />
                            <button 
                                onClick={() => this.setState({ toRoom: '' })}
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
                        <form>
                            <p>{this.state.roomName}</p>
                            <input type="password" />
                            <br />
                            <input type="submit" value="Enter" />
                            <button 
                                onClick={() => this.setState({ toRoom: '' })}
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
                <button className="RoomsButton" onClick={this.backToMain}>
                    Back to main
                </button>
            </div>
            <div className="ChooseRoom">
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