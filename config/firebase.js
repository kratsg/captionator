var firepad = require('firepad');

// the idea here is to use Firebase to sync our files only after 30 seconds of inactivity
var playTimers = {};

module.exports = function(firebaseRef, callback){

    firebaseRef.on("child_changed", function(snapshot){
        var playName = snapshot.key();
        if(playName in playTimers){
            clearTimeout(playTimers[playName]);
        }
        playTimers[playName] = setTimeout(function(){updatePlay(snapshot)}, 30*1000);

    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    var updatePlay = function(snapshot){
        var playName = snapshot.key();
        console.log('Updating a play: ', playName);
        var headless = new firepad.Headless(snapshot.ref());
        headless.getText(function(text){
            headless.dispose(); // don't need it anymore
            callback(playName, text);
        });
    };

};
