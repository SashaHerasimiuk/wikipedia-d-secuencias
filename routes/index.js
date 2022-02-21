var express = require('express');
var router = express.Router();
var secuences = require('../models/secuences');
var users = require('../models/users');
var admins = require('../models/admins');
var session = require('express-session');
var logs = require('../models/logs');

/* GET home page. */
router.get('/', async function(req, res, next) {
  var recents = await secuences.lastSecuences();

  if(req.session.username != undefined){
    if(req.session.admin){
      res.redirect('./admin/connected');
    }
    var connected = true;
    var username = req.session.username;
    res.render('index',{
      layout:'layout',
      recents,
      connected
    });
  }else{
    res.render('index', {
        recents, 
        layout:'layout' });
  }
});
  
    

router.post('/',async function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;
  var sess = await users.getUser(username, password);
  if (sess) {
    await logs.createLog(req, sess.username, 'logged in');
    req.session.username = sess.username;
    req.session.id = sess.user_id;
    var adminProve = await admins.proveAdmin(username);
    if (adminProve) {
      req.session.admin = true;
      res.redirect('./admin/connected');
    }else{
      res.redirect('./connected')
    }
  }else{
    var error = true;
    var message = 'incorrect username or password';
    res.render('index', {
      layout:'layout',
      message,
      error
    })
  }
})



router.get('/logout',async function(req, res, next){
  var username = req.session.username;
  if (username){
    await logs.createLog(req, req.session.username, 'disconnected');
  }else{
    res.redirect('/');
  }
  
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;