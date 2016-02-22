/*
    This requires play.js
*/
(function(){
    Mousetrap.bind(['right', 'down', 'space'], function(){
        socket.emit('move forward', {});
        play.moveForward();
    });

    Mousetrap.bind(['left', 'up', 'backspace'], function(){
        socket.emit('move backward', {});
        play.moveBackward();
    });

    Mousetrap.bind('b', function(){
        socket.emit('toggle blank screen', {});
        play.blankScreen('toggle');
    });

    Mousetrap.bind('g r i d', function(){
        socket.emit('toggle grid', {});
        play.toggleGrid();
    });

    Mousetrap.bind('s', function(){
        socket.emit('toggle source code', {});
        play.toggleCode('toggle');
    });

    var helpScreen = "[right], [down], [spacebar] to move forward\n"+
                     "[left], [up], [backspace] to move backward\n"+
                     "[b] to toggle the blank screen (changing slides hides me)\n"+
                     "[g r i d] to toggle the grid display (at 10px and 50px)\n"+
                     "[s] to toggle the source code for the given slide\n"+
                     "[?] to show this dialog";
    Mousetrap.bind('?', function(){alert(helpScreen)});

    socket.on('connect viewer', function(){
        console.log('a viewer has connected');
    });
})();
