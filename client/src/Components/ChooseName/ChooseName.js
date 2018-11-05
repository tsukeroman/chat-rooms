import React, { Component } from 'react';
import './ChooseName.css';

class ChooseName extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      nameErr: false
    }
  }

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


  handleChange = (event) => {
    this.setState({ username: event.target.value, nameErr: false });
  }

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
          <div></div>
        }
      </div>
    );
  }
}
  
  export default ChooseName;