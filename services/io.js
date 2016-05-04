var io = require('socket.io')();
var socketioJwt = require('socketio-jwt');
var config = require('../config');

var authorizer = socketioJwt.authorize({
    secret: config.services.jwt.secret,
    handshake: true
});


var authUsers = {},
    unauthUsers = {};

io.use(authorizer);

io.on('connection', function (socket) {
    socket.on('subscribe', function(play){
        socket.play = play;
        socket.join(play);
        console.log('['+new Date()+']  ', ((socket.decoded_token.user !== undefined)?"A":"Una")+"uthorized user joining "+socket.play);
        if(socket.decoded_token.user !== undefined){authUsers[socket.play] = (authUsers[socket.play] || 0) + 1;}
        else {unauthUsers[socket.play] = (unauthUsers[socket.play] || 0) +1;}
    });

    if(socket.decoded_token.user !== undefined){
        socket.on('move to', function(data){
            socket.broadcast.to(socket.play).emit('move to', data);
            console.log('['+new Date()+']  ', socket.play, "move to", data);
        });

        socket.on('toggle blank screen', function(){
            socket.broadcast.to(socket.play).emit('toggle blank screen', {});
            console.log('['+new Date()+']  ', socket.play, "toggle blank screen");
        });

        socket.on('toggle grid', function(){
            socket.broadcast.to(socket.play).emit('toggle grid', {});
            console.log('['+new Date()+']  ', socket.play, "toggle grid");
        });

        socket.on('toggle source code', function(){
            socket.broadcast.to(socket.play).emit('toggle source code', {});
            console.log('['+new Date()+']  ', socket.play, "toggle source code");
        });

        socket.on('refresh', function(){
            socket.broadcast.to(socket.play).emit('refresh', {});
            console.log('['+new Date()+']  ', socket.play, "refresh");
        });
    }

    socket.on('disconnect', function(){
        if(socket.decoded_token.user !== undefined){authUsers[socket.play]--;}
        else {unauthUsers[socket.play]--;}
        socket.broadcast.to(socket.play).emit('disconnect viewer', {authUsers: authUsers[socket.play], unauthUsers: unauthUsers[socket.play]});
        console.log('['+new Date()+']  ', socket.play, "disconnect viewer", {authUsers: authUsers[socket.play], unauthUsers: unauthUsers[socket.play]});
    });

    socket.on('connect viewer', function(data){
        socket.broadcast.to(socket.play).emit('connect viewer', {authUsers: authUsers[socket.play], unauthUsers: unauthUsers[socket.play]});
        console.log('['+new Date()+']  ', socket.play, "connect viewer", {authUsers: authUsers[socket.play], unauthUsers: unauthUsers[socket.play]});
    });
});

module.exports = io;
