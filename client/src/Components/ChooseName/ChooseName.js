import React, { Component } from 'react';
import './ChooseName.css';
import PropTypes from 'prop-types';

/*
This component is responsible for the name choose of the user.
*/
class ChooseName extends Component {
  static propTypes = {
    submitName: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      nameErr: false
    }
  }

  /*
  This function is responsible for validating the input, and preventing
  inputs that include characters that the server may interpret as 
  commands that it has to perform.
  Also, it prevents the user from choosing the name that the app uses
  for server messages, such as - user joined/left the chat.
  */
  validateInput = (str) => {
    const Restricted = `., !?;:"'~@#$%^&*+=/|<>(){}[]`;
    let i;
    for(i=0;i<Restricted.length;i++) {
      if(str.indexOf(Restricted[i]) !== -1) {
        return false;
      }
    }
    return true;
  }

  // This functions updates the state of the controlled input form.
  handleChange = (event) => {
    this.setState({ username: event.target.value, nameErr: false });
  }

  /*
  This function handles a name submition, first it checks whether the
  name is valid, and then allows the user to proceed with the chosen name.
  */
  handleSubmit = (event) => {
    event.preventDefault();
    if(this.validateInput(this.state.username) === false) {
      this.setState({ nameErr: true })
    } else {
      this.props.submitName(this.state.username);
    }
  }

  render() {
    return (
      <div className="Main">
        <div class="appName">Chat Rooms</div>
        <p> To start chatting please submit an username </p>
        <form className="NameForm" onSubmit={this.handleSubmit}>
          <input 
            type="text"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <input 
            type="submit"
            value="Start"
          />
        </form>
        {this.state.nameErr ? 
          <div className="nameErr">
            The username should contain only letters, numbers, dash and underscore.
            <br />
            Please try again.
          </div> 
          :
          null
        }
      </div>
    );
  }
}
  
export default ChooseName;