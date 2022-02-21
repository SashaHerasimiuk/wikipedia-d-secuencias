var router = require('express').Router();
var secuences = require('../models/secuences');
var solutions = require('../models/solutions');
var logs = require('../models/logs');
var alert = require('alert')

router.get('/', async function(req, res, next){
	try {
		if(req.query.secuence == undefined){
			res.redirect('/')
		}
		var secuence = req.query.secuence;
		var data = await secuences.getSecuence(secuence);
		var recents = await secuences.lastSecuences();
		var solves = await solutions.getSolutions(secuence);
		var admin = req.session.admin;
		console.log(solves);
		res.render('secuencePage', {
			admin,
			solves,
			recents,
			data,
			layout:'layout'
		})
	}catch (error){
		console.log(error, 'secuencePage:/');
	}
})

router.post('/trySolve',async function(req, res, next){
	if (req.session.username != undefined && req.session.username != ''){
		var secuence = req.body.secuence;
		await solutions.createSolution(secuence, req.body.solution, req.session.username);
		await logs.createLog(req, req.session.username, 'created solution for ' + secuence + ':' + req.body.solution);
		res.redirect('/secuences');
	}else{
		res.redirect('/');
	}
	
})


router.post('/solve', async function(req, res, next){
	var solve = req.body.solve;
	var secuence = req.body.secuence;
	if (req.session.admin) {
		await secuences.selectSolution(secuence, solve);
		await logs.createLog(req, req.session.username, 'selected solution '+ solve +' for '+secuence);
		res.redirect('/secuences')
	}else{
		await logs.createLog(req, 'unknown', 'tried to select solution '+ solve + 'for ' + secuence);
		var secuence = req.body.secuence;
		var data = await secuences.getSecuence(secuence);
		var recents = await secuences.lastSecuences();
		var solves = await solutions.getSolutions(secuence);
		var admin = req.session.admin;
		res.render('secuencePage',{
			data,
			recents,
			solves,
			layout:'layout',
			error:true,
			message:'you dont have the permissions to do that'
		});
	}
})


router.get('/changeDescription',async function(req, res, next){
	var newDescription = req.query.newDescription;
	var secuence = req.query.secuence;
	var recents = await secuences.lastSecuences();
	var solves = await solutions.getSolutions(secuence);
	await secuences.changeDescription(secuence, newDescription);
	var data = await secuences.getSecuence(secuence);
	console.log(secuence, newDescription)
	var admin = req.session.admin;
	res.render('secuencePage',{
			data,
			recents,
			solves,
			layout:'layout',
			admin
		});
});

module.exports = router;