var express = require('express');
var passport = require('passport');
var router = express.Router();

/* Authentication Sessions */

// route middleware to make sure a user is logged in
var isLoggedIn = function (req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};

router.get('/auth/facebook',
    passport.authenticate('facebook')
);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/plays',
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

router.get('/plays', function(req, res, next) {
    req.fs.readdir('./data/', function(err, plays){
        if(err) throw err;
        plays = plays.filter(function(play){ return play.substr((~-play.lastIndexOf(".") >>> 0)+2) == "yml"; })
                     .map(function(play){ return play.replace('.yml', '') });
        res.render('plays', {plays: plays});
    });
});

router.get('/play/:playName', isLoggedIn, function(req, res, next) {
    res.redirect('/play/'+req.params.playName+'/0');
});

/*
    To make our life easier, we will render the same page (play.jade) with extra JS depending on whether or not the person rendering it is a cuer (leader) or client (watcher).
*/
router.get('/play/:playName/:currIndex', isLoggedIn, function(req, res, next) {
    res.render('play', {
                        corpus: req.yaml.safeLoad(req.fs.readFileSync('./data/'+req.params.playName+'.yml')),
                        playName: req.params.playName,
                        title: req.params.playName.replace(/_/g, ' '),
                        currIndex: req.params.currIndex,
                        yaml: req.yaml,
                        client: false // control over changing slides or not
                       });
});

router.get('/watch/:playName/:currIndex', function(req, res, next) {
    res.render('play', {
                        corpus: req.yaml.safeLoad(req.fs.readFileSync('./data/'+req.params.playName+'.yml')),
                        playName: req.params.playName,
                        title: req.params.playName.replace(/_/g, ' '),
                        currIndex: req.params.currIndex,
                        yaml: req.yaml,
                        client: true // control over changing slides or not
                       });
});

router.get('/source/:playName', isLoggedIn, function(req, res, next) {
    res.render('source', {
                          corpus: req.fs.readFileSync('./data/'+req.params.playName+'.yml'),
                          playName: req.params.playName,
                          title: req.params.playName.replace(/_/g, ' '),
                          currIndex: req.params.currIndex,
                          yaml: req.yaml
                         });
});

router.get('/download/:playName', isLoggedIn, function(req, res, next) {
    res.download('./data/'+req.params.playName+'.yml');
});

module.exports = router;
