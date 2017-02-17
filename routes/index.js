var express = require('express');
var passport = require('passport');
var router = express.Router();

var config = require('../config')

var firebaseAdmin = require("firebase-admin");
var credential = require(config.services.firebase.credentialPath);
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(credential),
  databaseURL: config.services.firebase.databaseURL
});

var firepad = require('firepad');

/* Authentication Sessions */
// route middleware to make sure a user is logged in
var isLoggedIn = function (req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};

var isExistingPlay = function(req, res, next) {
    // first check to see if we've set it up in firebase yet, if we haven't, start it up
    var db = firebaseAdmin.database();
    db.ref('play_data/'+req.params.playName).once("value", function(snapshot){
        // need to make a headless and set the text first
        if(!snapshot.exists()){
          return next(new Error("That play does not exist!"));
        } else {
          req.snapshot = snapshot;
          return next();
        }
    });
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
    plays = [];
    firebaseAdmin.database().ref('plays').once("value", function(snapshot){
      snapshot.forEach(function(play){
        plays.push(play.key);
      });
      res.render('plays', {title: 'Plays', plays: plays});
    });
});

/*
    To make our life easier, we will render the same page (play.jade) with extra JS depending on whether or not the person rendering it is a cuer (leader) or client (watcher).
*/
router.get('/play/:playName/:currIndex', isLoggedIn, isExistingPlay, function(req, res, next) {
    var headless = new firepad.Headless(req.snapshot.child('firepad').ref);
    headless.getText(function(text){
        headless.dispose(); // don't need it anymore
        var corpus;
        try {
          corpus = req.yaml.safeLoad(text);
        } catch(e) {
          return next(e);
        }
        res.render('play', {
            corpus: corpus,
            playName: req.params.playName,
            title: req.params.playName.replace(/_/g, ' '),
            currIndex: req.params.currIndex,
            yaml: req.yaml,
            client: false // control over changing slides or not
        });
    });
});

router.get('/watch/:playName/:currIndex', isExistingPlay, function(req, res, next) {
    var headless = new firepad.Headless(req.snapshot.child('firepad').ref);
    headless.getText(function(text){
        headless.dispose(); // don't need it anymore
        var corpus;
        try {
          corpus = req.yaml.safeLoad(text);
        } catch(e) {
          return next(e);
        }
        res.render('play', {
            corpus: corpus,
            playName: req.params.playName,
            title: req.params.playName.replace(/_/g, ' '),
            currIndex: req.params.currIndex,
            yaml: req.yaml,
            client: true // control over changing slides or not
        });
    });
});

router.get('/source/:playName', isLoggedIn, isExistingPlay, function(req, res, next) {
    var headless = new firepad.Headless(req.snapshot.child('firepad').ref);
    headless.getText(function(text){
        headless.dispose(); // don't need it anymore

        res.render('source', {
            corpus: text,
            playName: req.params.playName,
            title: req.params.playName.replace(/_/g, ' '),
            currIndex: req.params.currIndex,
            yaml: req.yaml
        });
    });
});

router.get('/download/:playName', isLoggedIn, isExistingPlay, function(req, res, next) {
    var headless = new firepad.Headless(req.snapshot.child('firepad').ref);
    headless.getText(function(text){
        headless.dispose(); // don't need it anymore

        var Readable = require('stream').Readable

        var s = new Readable();
        s.push(text);    // the string you want
        s.push(null);      // indicates end-of-file basically - the end of the stream

        res.download(s, req.playName+'.yml');
    });
});

router.get('/edit/:playName', isLoggedIn, isExistingPlay, function(req, res, next) {
    firebaseAdmin.auth().createCustomToken("admin")
         .then(function(customToken){
            res.render('edit', {
                playName: req.params.playName,
                title: req.params.playName.replace(/_/g, ' '),
                firebaseToken: customToken
            });
          })
          .catch(function(error){
            return next("Error creating custom token: ", error);
          });
});

module.exports = router;
