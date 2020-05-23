'use strict';
const express = require('express');
const router = express.Router();

router.get('/new', (req, res, next) => {
  res.render('new', { user: req.user });
});

router.post('/', (req, res, next) => {
  var FILE = req.body;
  var obj = req.user;
  var UserName = obj.username;
  var filegazou = FILE.FILE; 
  console.log(filegazou);  // TODO 保存する実装をする
  console.log(UserName);
  //
});
module.exports = router;