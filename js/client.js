console.log('client.js loaded');

var socket = io();


jQuery('#form1').on('submit', function (e) {
    console.log('Inside form');
    e.preventDefault();
    var messageTextBox = jQuery('#m');
    socket.emit('chatMessage', {
        from: 'User',
        text: messageTextBox.val()
    });
        messageTextBox.val('');
    return false;
});


socket.on('connect', function () {
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    })
});

socket.on('chatMessage', function (msg) {
    console.log("Chat message")

    var createdAt = moment(msg.createdAt).format('h:mm a');
    $('#messages').append(jQuery('<li>')
        .text(createdAt + ": " + msg.text));


});

socket.on('locationMessage', function(msg) {
    console.log("Location message")

    var createdAt = moment(msg.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    var a = jQuery('<a> My current location</a>');
    li.text(createdAt + ": ")
    a.attr('href', msg.url);
    li.append(a);
    jQuery('#messages').append(li);

});
socket.on('newMessage', function (msg) {
    console.log('newMessage', msg);
    jQuery('#messages').append(jQuery('<li id="adminmessage">').text(msg.text));
});

socket.on('disconnect', function (msg) {
    console.log('User disconnected');
})

socket.on('updateUserList', function (users) {
    var ol = jQuery('<ol></ol>')
    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
})

var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('locationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        alert('Unable to fetch location.')
    })
})






