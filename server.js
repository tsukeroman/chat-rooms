const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'client/build'))); // maybe I need
// two ports, one for socket and one for the express app..
// later to figure it out...

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

io.on('connection', function(socket) {
    console.log(socket.id);
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

http.listen(port, () => {
    console.log('listening on *:' + port);
});