var router = require('express').Router();
var admins = require('../../models/admins');
var users = require('../../models/users');
var secuences = require('../../models/secuences');
var logs = require('../../models/logs');


router.get('/', async (req, res, next)=>{
	var userList = await users.getUsers();
	for (var i = 0; i < userList.length; i++){
		userList[i].isAdmin = await admins.proveAdmin(userList[i].username);
	}
	var recents = secuences.lastSecuences();
	res.render('admin/makeAdmin',{
		userList,
		layout:'layout',
		recents
	})
})

router.post('/switch', async function(req, res, next){
	var username = req.body.username;
	var admin = await admins.proveAdmin(username);
	var recents = await secuences.lastSecuences();
	console.log(username);
	console.log(admin)
	if(admin){
		await logs.createLog(req, req.session.username, 'revoked admin from '+ username)
		await admins.revokeAdmin(username);
		console.log('1');
	}else{
		await logs.createLog(req, req.session.username, 'made '+username+' admin');
		await admins.makeAdmin(username);
		console.log('2');
	}
	res.redirect('/admin/makeAdmin')

})

module.exports = router;
