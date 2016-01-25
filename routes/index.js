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

router.get('/play/:playName/:currIndex?', function(req, res, next) {
    res.render('play', {
                        corpus: req.yaml.safeLoad(req.fs.readFileSync('./data/'+req.params.playName+'.yml')),
                        playName: req.params.playName,
                        title: req.params.playName.replace(/_/g, ' '),
                        currIndex: (typeof req.params.currIndex === undefined ? 0 : req.params.currIndex)
                       });
});

module.exports = router;
