var express = require('express');
var router = express.Router();

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

router.get('/play/:playName', function(req, res, next) {
    res.redirect('/play/'+req.params.playName+'/0');
});

/*
    To make our life easier, we will render the same page (play.jade) with extra JS depending on whether or not the person rendering it is a cuer (leader) or client (watcher).
*/
router.get('/play/:playName/:currIndex', function(req, res, next) {
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

router.get('/source/:playName', function(req, res, next) {
    res.render('source', {
                          corpus: req.fs.readFileSync('./data/'+req.params.playName+'.yml'),
                          playName: req.params.playName,
                          title: req.params.playName.replace(/_/g, ' '),
                          currIndex: req.params.currIndex,
                          yaml: req.yaml
                         });
});

router.get('/download/:playName', function(req, res, next) {
    res.download('./data/'+req.params.playName+'.yml');
});

module.exports = router;
