var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express')

const {Users} = require("./js/users");
const {generateMessage, generateLocationMessage} = require('./js/message');
var users = new Users();

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/'));

io.on('connection', function (socket) {

    socket.on('join', function(params, callback) {
        socket.join(params.room);
        //socket.leave();
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', `Welcome to the chat (room ${params.room})`));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`User ${params.name} joined.`));
    });

    socket.on('locationMessage', (coords) => {
        var user = users.getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    })

    socket.on('disconnect', function () {
        console.log('user disconnected')
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `User ${user.name} has left.`))
        }
    });

    socket.on('chatMessage', function (msg) {
        console.log('message: ' + msg.text);
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('chatMessage', generateMessage(user, msg.text))
        }
    });
});

http.listen(app.get('port'), function () {
    console.log('listening on *:' + app.get('port'));
});
