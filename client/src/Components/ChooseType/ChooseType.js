import React, { Component } from 'react';
import './ChooseType.css';

class ChooseName extends Component {

  render() {
    return (
      <div className="Main">
        <button className='TypeButton' onClick={this.props.onPublic}>Public Chat</button>
        <button className='TypeButton' onClick={this.props.onPrivate}>Private Chats</button>
      </div>
    );
  }
}
  
  export default ChooseName;