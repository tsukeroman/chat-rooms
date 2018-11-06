import React, { Component } from 'react';
import './ChooseType.css';
import PropTypes from 'prop-types';

/*
This component is responsible for the chat type - public/private.
*/
class ChooseType extends Component {
  static propTypes = {
    onPrivate: PropTypes.func,
    onPublic: PropTypes.func
  };

  render() {
    return (
      <div className="Main">
        <button className='TypeButton' onClick={this.props.onPublic}>Public Chat</button>
        <button className='TypeButton' onClick={this.props.onPrivate}>Private Chats</button>
      </div>
    );
  }
}
  
export default ChooseType;