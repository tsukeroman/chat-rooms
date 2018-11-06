import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Room.css';

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