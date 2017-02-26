var play = (function(){
    var currSlideIndex = $('.slide.active').index('.slide');
    var maxNumberOfSlides = $('.slide').size();
    var playTitle = window.playName.replace(/_/g, ' ');
    var replaceState = function(index){
        currSlideIndex = index;
        history.replaceState({}, playTitle+": slide "+index, index);
    };

    // return the index we are moving to
    var moveTo = function(index){
        index = index || 0;
        if(index < 0) index = 0;
        if(index > maxNumberOfSlides-1) index = maxNumberOfSlides-1;
        if(index == currSlideIndex) return null;
        var currSlide = $('.slide.active');
        var nextSlide = $('.slide:eq('+index+')');
        if(currSlide.get(0).isEqualNode(nextSlide.get(0))) return null;
        // negative indices are technically allowed, let's not do that
        if(nextSlide && nextSlide.length){
            currSlide.removeClass('active');
            nextSlide.addClass('active');
            replaceState(index);
        }
        blankScreen('hide');
        return index;
    };

    // n = how many slides to move ahead by
    var moveForward = function(n){
        n = n || 1;
        return moveTo(currSlideIndex+n);
    };
    var moveBackward = function(n){
        n = n || 1;
        return moveTo(currSlideIndex-n);
    };

    var blankScreen = function(method){
        if(typeof method == "undefined") method = 'toggle';
        if(method == 'toggle') $('body').toggleClass('blankScreen');
        if(method == 'hide')   $('body').removeClass('blankScreen');
        if(method == 'show')   $('body').addClass('blankScreen');
    };

    var toggleGrid = function(){
        $('body').toggleClass('grid');
    };

    socket.emit('connect viewer', {});
    socket.on('move forward', function(){moveForward()});
    socket.on('move backward', function(){moveBackward()});
    socket.on('move to', moveTo);
    socket.on('toggle blank screen', function(){blankScreen('toggle');});
    socket.on('toggle grid', toggleGrid);
    socket.on('refresh', function(){location.reload(true);});

    return {
        moveForward: moveForward,
        moveBackward: moveBackward,
        blankScreen: blankScreen,
        toggleGrid: toggleGrid
    };
})();
