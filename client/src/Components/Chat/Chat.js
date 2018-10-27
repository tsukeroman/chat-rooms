import React, { Component } from 'react';
import io from 'socket.io-client';
import uuid from 'uuid';
import './Chat.css';

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            messages: [],
            users: []
        }

        this.socket = io('localhost:5000', { query: `username=${this.props.username}`});

        this.socket.on('connected', function(data) {
            userConnected(data);
        });

        this.socket.on('disconnect', function (data) {
            userDisconnected(data);
        });

        this.socket.on('chat message', function(data) {
            addMessage(data);
        });

        const addMessage = data => {
            console.log(data);
            this.setState({ messages: [...this.state.messages, data] });
            console.log(this.state.messages);
        };

        const userConnected = data => {
            console.log(data);
            if (data[data.length-1] !== this.props.username) {
                const msg = { 
                    'username': this.props.secret_name, 
                    'message': `${data[data.length-1]} is now connected`
                };
                this.setState({ 
                    users: data,
                    messages: [...this.state.messages, msg ]
                }); 
            } else {
                this.setState({
                    users: data
                });
            }
            console.log(this.state.users);
        };

        const userDisconnected = data => {
            const msg = { 
                'username': this.props.secret_name, 
                'message': `${data.user} has left the chat`
            };
            this.setState({ 
                users: data.users,
                messages: [...this.state.messages, msg ]
            });
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

    backToMain = () => {
        this.socket.disconnect();
        this.props.backToMain();
    }

    render() {
      return (
        <div className="Chat">
            <div className="Left">
                <button 
                    className="toMain" 
                    onClick={this.backToMain}
                >
                    Back To Main
                </button>
                <div className="title">Users Online</div>
                <div className="connectedUsers">
                    <ul className="users">
                        {this.state.users.map(user => {
                            return (
                                <li className="user" key={uuid.v4()}>{user}</li>
                            )
                        })}
                    </ul>
                </div>
            </div>
            <div className="Right">
                <ul className="messages">
                    {this.state.messages.map(item => {
                        let msg = item.username + ': ' + item.message;
                        if (item.username === this.props.username) {
                            msg = <b>{msg}</b>
                        }
                        else if (item.username === this.props.secret_name) {
                            msg = item.message;
                        }
                        return (
                            <li className="message" key={uuid.v4()}>{msg}</li>
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
        </div>
      );
    }
  }
  
  export default Chat;