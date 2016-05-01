var play = (function(){
    var currSlideIndex = $('.slide.active').index('.slide');
    var playTitle = window.playName.replace(/_/g, ' ');
    var replaceState = function(index){
        currSlideIndex = index;
        history.replaceState({}, playTitle+": slide "+index, index);
    };

    var moveTo = function(index){
        index = index || 0;
        var currSlide = $('.slide.active');
        var nextSlide = $('.slide:eq('+index+')');
        // negative indices are technically allowed, let's not do that
        if(index >= 0 && nextSlide && nextSlide.length){
            currSlide.removeClass('active');
            nextSlide.addClass('active');
            replaceState(index);
        }
        blankScreen('hide');
        return false;
    };

    var moveForward = function(){
        return moveTo(currSlideIndex+1);
    };

    var moveBackward = function(){
        return moveTo(currSlideIndex-1);
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
