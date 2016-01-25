(function(){
    var playTitle = window.playName.replace(/_/g, ' ');
    var pushState = function(index){
        history.pushState({}, playTitle+": slide "+index, "/"+index);
    };

    var moveForward = function(){
        var currSlide = $('.slide.active');
        var nextSlide = currSlide.next('.slide');
        if(nextSlide && nextSlide.length){
            currSlide.removeClass('active');
            nextSlide.addClass('active');
            pushState(nextSlide.index());
        }
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
        return false;
    };

    var blankScreen = function(){
        $('body').toggleClass('hide');
    };

    Mousetrap.bind(['right', 'down', 'space'], moveForward);
    Mousetrap.bind(['left', 'up', 'backspace'], moveBackward);
    Mousetrap.bind('b', blankScreen);
})();
