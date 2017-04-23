console.log('client.js loaded');
$(function () {
    var socket = io();
    $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
    socket.on('newMessage', function (msg) {
        console.log('newMessage', msg);
        $('#messages').append($('<li id="adminmessage">').text(msg.text));
    });

});