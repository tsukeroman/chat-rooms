import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Room.css';

/*
This component is responsible to represent an existing room button
in the Rooms component. A click on this component causes an opening 
of a room sign-in window.
*/
class Room extends Component {
  static propTypes = {
    roomName: PropTypes.string,
    openRoom: PropTypes.func
  };

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