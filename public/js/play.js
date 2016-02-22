var play = (function(){
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
            pushState(nextSlide.index('.slide'));
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
            pushState(prevSlide.index('.slide'));
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

    var toggleGrid = function(){
        $('body').toggleClass('grid');
    };

    var toggleCode = function(method){
        if(typeof method == "undefined") method = 'toggle';
        if(method == 'toggle') $('body').toggleClass('showCode');
        if(method == 'hide')   $('body').removeClass('showCode');
        if(method == 'show')   $('body').addClass('showCode');
    };
    hljs.initHighlightingOnLoad();

    socket.emit('connect viewer', {});
    socket.on('move forward', moveForward);
    socket.on('move backward', moveBackward);
    socket.on('toggle blank screen', function(){blankScreen('toggle');});
    socket.on('toggle grid', toggleGrid);
    socket.on('toggle source code', function(){toggleCode('toggle');});

    return {
        moveForward: moveForward,
        moveBackward: moveBackward,
        blankScreen: blankScreen,
        toggleGrid: toggleGrid,
        toggleCode: toggleCode
    };
})();
