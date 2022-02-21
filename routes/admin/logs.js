var router = require('express').Router();
var logs = require('../../models/logs');




router.get('/', async function(req, res, next){
	var changelog = await logs.getLogs();
	var username = req.session.username;
	res.render('admin/logs',{
		username,
		changelog,
		layout:'layout'
	})
})

module.exports = router;