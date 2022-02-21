var router = require('express').Router();
var users = require('../models/users');
var secuences = require('../models/secuences');

router.get('/', async (req,res,next)=>{
	var recents = await secuences.lastSecuences();
	res.render('createUser',{
		recents,
		layout:'layout'
	})
})

router.post('/', async (req, res, next)=>{
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	console.log(username, password, email)
	if (username == '' || password == '' || email == '') {
		var error = true;
		var recents = await secuences.lastSecuences();
		var message = 'all entries must be filled';
			res.render('createUser', {
				error,
				layout:'layout',
				recents,
				message
			});
	}else{
		var cosa = await users.createUser(username, password, email);
		if(cosa[0]){
			var error = true;
			var recents = await secuences.lastSecuences();
			var message = cosa[1];
			res.render('createUser', {
				error,
				layout:'layout',
				recents,
				message
			});
		}else{
			res.redirect('/login');
		}
	}
});

module.exports = router