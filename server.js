/*
This file is the app's server. Here we initialize our Express app, which runs the server.
The server initializes a WebSocket (using Socket.io packcage), that exists on the server,
and is responsible for communication between different users by transmitting messages
between them.
The server has some API endpoints which the client calls and gets back the data it needs
from the server.
*/


const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5000; 
let rooms = { 'public-chat': { 'users': [] } };
let users = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client/build'))); 

/*
This end-point gets a username and a chatname from the client, and responds 
with true/false accordingly to whether the user presenets in the specific
room or not.
*/
app.post('/userExist', function(req, res){
    const { username, chatname } = req.body;
    if (rooms[chatname]['users'].indexOf(username) !== -1) {
        res.json(true);
    } else {
        res.json(false);
    }
});

/*
This end-point gets a roomName and a password from the client, and checks whether 
a room with this name already exist on the server. If doesn't exist, it initializes an 
entry for the room in the rooms object that exists on the server, and responds to 
the client with a list with the names of all the rooms. 
*/
app.post('/newRoom', function(req, res){
    const { roomName, password } = req.body;
    if(rooms[roomName]) {
        res.json(false);
    } else {
        rooms[roomName] = { 'password': password, 'users': [] };
        let roomNames = Object.keys(rooms)
        roomNames=roomNames.filter(item => item !== 'public-chat');
        res.json({ Rooms: roomNames });
    }
});

/*
This end-point gets a roomName and a password from the client, and checks if the
password matches the password of the room. Another scenario that this endpoint 
handles, is a situation when a user tries to access a room that has just been 
deleted (since all the users left the room).
The end-point responds with a strings that describes the situation.
*/
app.post('/enterRoom', function(req, res){
    const { roomName, password } = req.body;
    let success = "wrongPassword";
    if (!rooms[roomName]) {
        success = "noExist";
    }
    else if(rooms[roomName]['password'] === password) {
        success = "Ok";
    }
    res.json({ success });
});

/*
This end-point is responsible for serving the client the most updated
list of the room names.
*/
app.get('/getRooms', function(req, res){
    let roomNames = Object.keys(rooms);
    roomNames = roomNames.filter(item => item !== 'public-chat');
    res.json({ Rooms: roomNames });
});


/*
Here we initialize a WebSocket, which is responsible for the real-time
communication between the different users. The users pass events to the 
server by the socket, and the server responds in a real-time with passing
the events by the socket forward to the other users.
The server handles events such a user connection to the chat, user's leaving
from the chat and messaging.
This socket is responsible for multiple rooms, and it manages the public chat
and the private chat rooms.
io.emit(...) is responsible for passing data forward, and
socket.on(...) is responsible for getting data.
*/
io.on('connection', function(socket) {

    const chatname = socket.handshake.query.chatname;
    const username = socket.handshake.query.username;

    socket.join(chatname);

    rooms[chatname]['users'] = [...rooms[chatname]['users'], username];

    //the .to(...) allows the server to emit an event to a specific room
    io.to(chatname).emit('connected', rooms[chatname]['users']);

    socket.on('chat message', function(msg){
        io.to(chatname).emit('chat message', msg);
    });
    
    socket.on('disconnect', function() {
        rooms[chatname]['users'] = rooms[chatname]['users'].filter(item => item !== username);
        if(rooms[chatname]['users'].length === 0 && chatname != 'public-chat') {
            delete rooms[chatname];
        } else {
            io.to(chatname).emit('disconnect', { 'users': rooms[chatname]['users'], 'user': username });
        }
    })
});

/*
This endpoint is responsible for serving the app to the client, when he
enters the app.
*/
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

/*
Sets the server to listen to the port we initialized above,
*/
http.listen(port, () => {
    console.log('listening on *:' + port);
});