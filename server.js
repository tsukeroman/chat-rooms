const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5000; 
let rooms = { 'public-chat': { 'users': [] } };

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client/build'))); 

app.post('/newRoom', function(req, res){
    console.log(req.body);
    const { roomName, password } = req.body;
    rooms[roomName] = { 'password': password, 'users': [] };
    let roomNames = Object.keys(rooms)
    roomNames=roomNames.filter(item => item !== 'public-chat');
    res.json({ Rooms: roomNames });
});

app.post('/enterRoom', function(req, res){
    console.log(req.body);
    const { roomName, password } = req.body;
    let success = false;
    if(rooms[roomName]['password'] === password) {
        success = true;
    }
    res.json({ success });
});

app.get('/getRooms', function(req, res){
    let roomNames = Object.keys(rooms);
    roomNames = roomNames.filter(item => item !== 'public-chat');
    res.json({ Rooms: roomNames });
});

io.on('connection', function(socket) {

    const chatname = socket.handshake.query.chatname;
    const username = socket.handshake.query.username;

    console.log(username);
    console.log(chatname);

    socket.join(chatname);

    rooms[chatname]['users'] = [...rooms[chatname]['users'], username];

    io.to(chatname).emit('connected', rooms[chatname]['users']);

    socket.on('chat message', function(msg){
        io.to(chatname).emit('chat message', msg);
    });
    
    socket.on('disconnect', function() {
        rooms[chatname]['users'] = rooms[chatname]['users'].filter(item => item !== username);
        io.to(chatname).emit('disconnect', { 'users': rooms[chatname]['users'], 'user': username });
    })
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

http.listen(port, () => {
    console.log('listening on *:' + port);
});