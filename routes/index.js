var express = require('express');
var passport = require('passport');
var router = express.Router();

var config = require('../config')
var FirebaseTokenGenerator = require('firebase-token-generator');
var tokenGenerator = new FirebaseTokenGenerator(config.auth.firebase.secret);

// this is for checking what plays exist, for example
var Firebase = require('firebase');
var firebaseRef = new Firebase(config.auth.firebase.project);

/* Authentication Sessions */

// route middleware to make sure a user is logged in
var isLoggedIn = function (req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};

router.get('/auth/facebook',
    passport.authenticate('facebook', {scope: ['public_profile']})
);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true,
        display: 'popup' // not using javascript SDK
    })
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Captionator' });
});

router.get('/me', isLoggedIn, function(req, res, next) {
    res.render('me');
});

router.get('/plays', function(req, res, next) {
    req.fs.readdir('./data/', function(err, plays){
        if(err) throw err;
        plays = plays.filter(function(play){ return play.substr((~-play.lastIndexOf(".") >>> 0)+2) == "yml"; })
                     .map(function(play){ return play.replace('.yml', '') });
        res.render('plays', {title: 'Plays', plays: plays});
    });
});

/*
    To make our life easier, we will render the same page (play.jade) with extra JS depending on whether or not the person rendering it is a cuer (leader) or client (watcher).
*/
router.get('/play/:playName/:currIndex', isLoggedIn, function(req, res, next) {
    res.render('play', {
                        corpus: req.yaml.safeLoad(req.fs.readFileSync('./data/'+req.params.playName+'.yml','utf8')),
                        playName: req.params.playName,
                        title: req.params.playName.replace(/_/g, ' '),
                        currIndex: req.params.currIndex,
                        yaml: req.yaml,
                        client: false // control over changing slides or not
                       });
});

router.get('/watch/:playName/:currIndex', function(req, res, next) {
    res.render('play', {
                        corpus: req.yaml.safeLoad(req.fs.readFileSync('./data/'+req.params.playName+'.yml','utf8')),
                        playName: req.params.playName,
                        title: req.params.playName.replace(/_/g, ' '),
                        currIndex: req.params.currIndex,
                        yaml: req.yaml,
                        client: true // control over changing slides or not
                       });
});

router.get('/source/:playName', isLoggedIn, function(req, res, next) {
    res.render('source', {
                          corpus: req.fs.readFileSync('./data/'+req.params.playName+'.yml','utf8'),
                          playName: req.params.playName,
                          title: req.params.playName.replace(/_/g, ' '),
                          currIndex: req.params.currIndex,
                          yaml: req.yaml
                         });
});

router.get('/download/:playName', isLoggedIn, function(req, res, next) {
    res.download('./data/'+req.params.playName+'.yml');
});

router.get('/edit/:playName', isLoggedIn, function(req, res, next) {
    // we assume the file exists
    var corpus = req.fs.readFileSync('./data/'+req.params.playName+'.yml','utf8');

    var renderCallback = function(){
        res.render('edit', {
                              playName: req.params.playName,
                              title: req.params.playName.replace(/_/g, ' '),
                              currIndex: req.params.currIndex,
                              yaml: req.yaml,
                              firebaseToken: tokenGenerator.createToken({uid:"admin"})
                             });
    };

    // first check to see if we've set it up in firebase yet, if we haven't, start it up
    firebaseRef.authWithCustomToken(tokenGenerator.createToken({uid:"admin"}));
    firebaseRef.child(req.params.playName).once("value", function(snapshot){
        // need to make a headless and set the text first
        if(!snapshot.exists()){
            var firepad = require('firepad');
            var playName = snapshot.key();
            var headless = new firepad.Headless(snapshot.ref());
            headless.setText(corpus, function(err, committed){
                headless.dispose(); // don't need it anymore
                renderCallback();
            });
        } else {
            renderCallback();
        }
    })
});

module.exports = router;
