var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express')

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/'));

io.on('connection', function (socket) {

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the chat'
    });
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'new user joined',
        createdAt: new Date().getDate()
    });
    console.log('user connected')
    socket.on('disconnect', function () {
        console.log('user disconnected')
    })
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg)
    });
});

http.listen(app.get('port'), function () {
    console.log('listening on *:' + app.get('port'));
});
