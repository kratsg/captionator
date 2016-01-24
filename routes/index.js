var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:play_name', function(req, res, next) {
    res.render('caption', {corpus: yaml.safeLoad(fs.readFileSync('./data/'+req.params.play_name+'.yml'))});
});

module.exports = router;
