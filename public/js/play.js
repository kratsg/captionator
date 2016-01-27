(function(){
    var playTitle = window.playName.replace(/_/g, ' ');
    var pushState = function(index){
        history.pushState({}, playTitle+": slide "+index, index);
    };

    var moveForward = function(){
        var currSlide = $('.slide.active');
        var nextSlide = currSlide.next('.slide');
        if(nextSlide && nextSlide.length){
            currSlide.removeClass('active');
            nextSlide.addClass('active');
            pushState(nextSlide.index());
        }
        blankScreen('hide');
        return false;
    };

    var moveBackward = function(){
        var currSlide = $('.slide.active');
        var prevSlide = currSlide.prev('.slide');
        if(prevSlide && prevSlide.length){
            currSlide.removeClass('active');
            prevSlide.addClass('active');
            pushState(prevSlide.index());
        }
        blankScreen('hide');
        return false;
    };

    var blankScreen = function(method){
        if(typeof method == "undefined") method = 'toggle';
        if(method == 'toggle') $('body').toggleClass('hide');
        if(method == 'hide')   $('body').removeClass('hide');
        if(method == 'show')   $('body').addClass('hide');
    };

    Mousetrap.bind(['right', 'down', 'space'], moveForward);
    Mousetrap.bind(['left', 'up', 'backspace'], moveBackward);
    Mousetrap.bind('b', function(){blankScreen('toggle');});

    var helpScreen = "[right], [down], [spacebar] to move forward\n"+
                     "[left], [up], [backspace] to move backward\n"+
                     "[b] to toggle the blank screen (changing slides hides me)\n"+
                     "[?] to show this dialog";
    Mousetrap.bind('?', function(){alert(helpScreen)});
})();
