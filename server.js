const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const port = process.env.PORT || 5000;
let users = []; 

app.use(express.static(path.join(__dirname, 'client/build'))); // maybe I need
// two ports, one for socket and one for the express app..
// later to figure it out...

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

io.on('connection', function(socket) {
    
    //console.log(socket.id);
    console.log(socket.handshake.query.username);
    
    //users = [...users, socket.id]
    users = [...users, socket.handshake.query.username]

    io.emit('connected', users);
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
    
    /*socket.on('disconnect', function() {
        users = users.filter(item => item !== socket.id);
        io.emit('disconnect', { users, 'user': socket.id });
    })*/
    socket.on('disconnect', function() {
        users = users.filter(item => item !== socket.handshake.query.username);
        io.emit('disconnect', { users, 'user': socket.handshake.query.username });
    })
});

http.listen(port, () => {
    console.log('listening on *:' + port);
});