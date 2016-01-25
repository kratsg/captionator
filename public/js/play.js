(function(){
    var moveForward = function(){
        var currSlide = $('.slide.active');
        var nextSlide = currSlide.next('.slide');
        if(nextSlide && nextSlide.length){
            currSlide.removeClass('active');
            nextSlide.addClass('active');
        }
        return false;
    };

    var moveBackward = function(){
        var currSlide = $('.slide.active');
        var prevSlide = currSlide.prev('.slide');
        if(prevSlide && prevSlide.length){
            currSlide.removeClass('active');
            prevSlide.addClass('active');
        }
        return false;
    };

    Mousetrap.bind(['right', 'down', 'space'], moveForward);
    Mousetrap.bind(['left', 'up', 'backspace'], moveBackward);
})();
