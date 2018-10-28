import React, { Component } from 'react';
import './Room.css';

class Room extends Component {
  /*
  constructor(props) {
    super(props);

    this.state = {
      name: this   
    }
  }
  */

  openRoom = () => {
    this.props.openRoom(this.props.roomName);
  }

  render() {
    return (
        <div className="Room" onClick={this.openRoom}>
            {this.props.roomName}
        </div>
    );
  }
}
  
  export default Room;