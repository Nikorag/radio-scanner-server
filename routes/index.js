var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/channelList', function(req, res, next) {
  const buffer = fs.readFileSync(__dirname+"/../ChannelList.csv");
  const fileContent = buffer.toString();
  res.send(fileContent);
});

module.exports = router;
