/*
    This requires play.js
*/
(function(){

    var movePlay = function(slideIndex){
        if(slideIndex !== null) socket.emit('move to', slideIndex);
    };

    Mousetrap.bind(['right', 'down', 'space'], function(){
        movePlay(play.moveForward());
    });

    Mousetrap.bind(['left', 'up', 'backspace'], function(){
        movePlay(play.moveBackward());
    });

    Mousetrap.bind(['shift+left', 'shift+up', 'shift+backspace'], function(){
        movePlay(play.moveBackward(2));
    });

    Mousetrap.bind(['shift+right', 'shift+down', 'shift+space'], function(){
        movePlay(play.moveForward(2));
    });

    Mousetrap.bind('b', function(){
        socket.emit('toggle blank screen', {});
        play.blankScreen('toggle');
    });

    Mousetrap.bind('g r i d', function(){
        socket.emit('toggle grid', {});
        play.toggleGrid();
    });

    Mousetrap.bind('r', function(){
        socket.emit('refresh', {});
    });

    var helpScreen = "[right], [down], [spacebar] to move forward 1 slide\n"+
                     "[left], [up], [backspace] to move backward 1 slide\n"+
                     "[shift]+([right], [down], [spacebar]) to move forward 2 slides\n"+
                     "[shift]+([left], [up], [backspace]) to move backward 2 slides\n"+
                     "[b] to toggle the blank screen (changing slides hides me)\n"+
                     "[g r i d] to toggle the grid display (at 10px and 50px)\n"+
                     "[r] to reload the watcher pages\n"+
                     "[?] to show this dialog";
    Mousetrap.bind('?', function(){alert(helpScreen)});

    socket.on('connect viewer', function(data){
        $('#viewerStatus').attr('data-unauthUsers', data['unauthUsers']);
        console.log('someone has connected');
    });

    socket.on('disconnect viewer', function(data){
        $('#viewerStatus').attr('data-unauthUsers', data['unauthUsers']);
        console.log('someone has disconnected');
    });
})();
