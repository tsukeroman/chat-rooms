import React, { Component } from 'react';
import './ChooseName.css';

class ChooseName extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: ''
    }
  }

  handleChange = (event) => {
    this.setState({ username: event.target.value });
  }

  handleSubmit = (event) => {
      event.preventDefault();
      this.props.submitName(this.state.username);
  }

  render() {
    return (
      <div className="Main">
        <p> To start chatting please submit an username </p>
        <form onSubmit={this.handleSubmit}>
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
      </div>
    );
  }
}
  
  export default ChooseName;