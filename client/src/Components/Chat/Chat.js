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
/*
        this.socket.on('connected', function() {
            this.socket.emit('user connected', {
                username: this.props.username
            });
        });
*/
        const addMessage = data => {
            console.log(data);
            this.setState({ messages: [...this.state.messages, data] });
            console.log(this.state.messages);
        };
    }

    handleChange = (event) => {
        this.setState({ message: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.socket.emit('chat message', {
            message: this.state.message,
            username: this.props.username
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
                    let msg = item.username + ': ' + item.message;;
                    if (item.username === this.props.username) {
                        msg = <b>{msg}</b>
                    }
                    return (
                        <li key={uuid.v4()}>{msg}</li>
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