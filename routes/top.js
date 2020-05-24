var express = require('express');
var router = express.Router();
var config = require('../config');

const Twit = require('twit');
const twitter = new Twit({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token: config.twitter.access_token,
  access_token_secret: config.twitter.access_token_secret
});

var params = {q:'#N予備校プログラミング入門',count:2};
var hairetu = [];
twitter.get('search/tweets', params, function(error, tweets, response) {
  if (error) console.log(error);
  var Text = tweets.statuses[1].text;
  var Name = tweets.statuses[1].user.name;
  var UserName =tweets.statuses[1].user.screen_name
  hairetu = [Text,Name,UserName];
  console.log(UserName + '(' + Name + ') :' + Text);
  //fs.appendFileSync("timeline.json",JSON.stringify(tweets) + "\n","utf-8");
  //const obj = fs.readFileSync("timeline.json","utf-8");
  //console.log(obj.statuses[1].text);
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('top', { title: 'top',user:req.user,JYOUHOU:hairetu});
});

module.exports = router;