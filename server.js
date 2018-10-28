const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5000;
let users = []; 
let rooms = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client/build'))); 

app.post('/newRoom', function(req, res){
    console.log(req.body);
    rooms = [...rooms, req.body];
    const roomNames = rooms.map(room => room.roomName);
    res.json({ Rooms: roomNames });
});

app.post('/enterRoom', function(req, res){
    console.log(req.body);
    let success = false;
    rooms.forEach((room) => {
        if(room.roomName === req.body.roomName) {
            if(room.password === req.body.password) {
                success = true;
            }
        }
    })
    res.json({ success });
});

app.get('/getRooms', function(req, res){
    const roomNames = rooms.map(room => room.roomName)
    res.json({ Rooms: roomNames });
});

io.on('connection', function(socket) {

    console.log(socket.handshake.query.username);
    
    users = [...users, socket.handshake.query.username]

    io.emit('connected', users);
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
    
    socket.on('disconnect', function() {
        users = users.filter(item => item !== socket.handshake.query.username);
        io.emit('disconnect', { users, 'user': socket.handshake.query.username });
    })
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

http.listen(port, () => {
    console.log('listening on *:' + port);
});