import React, { Component } from 'react';
import io from 'socket.io-client';
import uuid from 'uuid';
import './Chat.css';
import PropTypes from 'prop-types';

/*
This component is the most important component of the App,
since it represents the chat itself.
The component consists of a side bar that shows a list of users
that are connected to the chat, a main window of all the messages and
the actions (such as another user joins/leaves the chat) since the
moment that the user himself joined to this room, and an input form
with a send button, where the user is supposed to write his messages.
*/
class Chat extends Component {
    static propTypes = {
        chatName: PropTypes.string,
        username: PropTypes.string,
        secret_name: PropTypes.string,
        backToMain: PropTypes.func
    };

    /*
    The state maintains an array of all the messages in the chat since
    the user has joined the room, a list of the users that are connected
    to this room, and a string for a controlled input for user's message.
    */
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            messages: [],
            users: []
        }

        /*
        Here the WebSocket connection between the client and the server is being
        established. At the moment of the connection, the client passes the server
        it's username and the name of the room that he's in within a query.
        socket.on(...) is responsible for getting data from the server,
        and socket.emit(...) is responsible for sending data to the server.
        */
        this.socket = io('localhost:5000', { query: 
            `username=${this.props.username}&chatname=${this.props.chatName}`
        });

        this.socket.on('connected', function(data) {
            userConnected(data);
        });

        this.socket.on('disconnect', function (data) {
            userDisconnected(data);
        });

        this.socket.on('chat message', function(data) {
            addMessage(data);
        });

        // This function adds a new message to the list of messages in the state.
        const addMessage = data => {
            this.setState({ messages: [...this.state.messages, data] });
        };

        /*
        This function adds to messages a message from the server whenever 
        an other user connects to the room.
        */
        const userConnected = data => {
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
        };

        /*
        This function adds to messages a message from the server whenever 
        an other user disconnects from the room.
        */
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

    /*
    This function updates the state whenever there is a change in user's
    message controled input form.
    */
    handleChange = (event) => {
        this.setState({ message: event.target.value });
    }

    /*
    This function is responsible for passing a message to the server
    by the WebSocket, and to clear the message input form.
    */
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

    /*
    This function is responsible for notifying the server by the
    WebSocket whenever the user leaves the room, and it notifies 
    the App itself too, by passing the change up to the main component.
    */
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
                            maxlength="150"
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