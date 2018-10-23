import React, { Component } from 'react';
import io from 'socket.io-client';
import uuid from 'uuid';
import './Chat.css';

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            messages: []
        }

        this.socket = io('localhost:5000');

        this.socket.on('chat message', function(data) {
            addMessage(data);
        });

        const addMessage = data => {
            console.log(data);
            this.setState({ messages: [...this.state.messages, this.props.username +': ' + data.message] });
            console.log(this.state.messages);
        };
    }

    handleChange = (event) => {
        this.setState({ message: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.socket.emit('chat message', {
            message: this.state.message
        });
        this.setState({
            message: ''
        });
    }

    render() {
      return (
        <div className="Chat">
            <ul className="messages">
                {this.state.messages.map(item => {
                    return (
                        <li key={uuid.v4()}>{item}</li>
                    )
                })}
            </ul>
            <form className="form" onSubmit={this.handleSubmit}>
                <input 
                    type="text"
                    className="input" 
                    value={this.state.message}
                    onChange={this.handleChange} 
                />
                <input 
                    className="button"
                    type="submit"
                    value="Send" 
                />
            </form>
        </div>
      );
    }
  }
  
  export default Chat;