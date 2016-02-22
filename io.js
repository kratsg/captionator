var io = require('socket.io')();

io.on('connection', function (socket) {
    socket.on('subscribe', function(play){
        socket.play = play;
        socket.join(play);
    });

    socket.on('move forward', function(){
        socket.broadcast.to(socket.play).emit('move forward', {});
    });

    socket.on('move backward', function(){
        socket.broadcast.to(socket.play).emit('move backward', {});
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

    socket.on('connect viewer', function(data){
        socket.broadcast.to(socket.play).emit('connect viewer', {});
    });
});

module.exports = io;
