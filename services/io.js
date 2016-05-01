var io = require('socket.io')();
var socketioJwt = require('socketio-jwt');
var config = require('../config');

var authorizer = socketioJwt.authorize({
    secret: config.services.jwt.secret,
    handshake: true
});

io.use(authorizer);

io.on('connection', function (socket) {
    socket.on('subscribe', function(play){
        socket.play = play;
        socket.join(play);
    });

    if(socket.decoded_token.user !== undefined){
        socket.on('move to', function(data){
            socket.broadcast.to(socket.play).emit('move to', data);
        });

        socket.on('toggle blank screen', function(){
            socket.broadcast.to(socket.play).emit('toggle blank screen', {});
        });

        socket.on('toggle grid', function(){
            socket.broadcast.to(socket.play).emit('toggle grid', {});
        });

        socket.on('toggle source code', function(){
            socket.broadcast.to(socket.play).emit('toggle source code', {});
        });
    }

    socket.on('connect viewer', function(data){
        socket.broadcast.to(socket.play).emit('connect viewer', {});
    });
});

module.exports = io;
