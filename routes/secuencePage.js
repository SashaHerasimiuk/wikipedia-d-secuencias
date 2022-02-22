var router = require('express').Router();
var secuences = require('../models/secuences');
var solutions = require('../models/solutions');
var logs = require('../models/logs');
var alert = require('alert')

var cloudinary = require('cloudinary').v2;
var util = require('util');
const uploader = util.promisify(cloudinary.uploader.upload)


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
		var image = '';
		if (data.id_img) {
			image = cloudinary.image(data.id_img, {
				width:200,
				height:200,
				crop:'fill'
			})
		}
		res.render('secuencePage', {
			admin,
			solves,
			recents,
			data,
			layout:'layout',
			image
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
		var image = '';
		if (data.id_img) {
			image = cloudinary.image(data.id_img, {
				width:200,
				height:200,
				crop:'fill'
			})
		}
		var admin = req.session.admin;
		res.render('secuencePage',{
			data,
			recents,
			solves,
			layout:'layout',
			error:true,
			message:'you dont have the permissions to do that',
			image
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
	var image = '';
	if (data.id_img) {
		image = cloudinary.image(data.id_img, {
			width:200,
			height:200,
			crop:'fill'
		})
	}
	res.render('secuencePage',{
			data,
			recents,
			solves,
			layout:'layout',
			admin,
			image
		});
});


router.post('/changeImage', async function(req, res, next){
	try{
		var admin = req.session.admin;
		var img_id ='';
		var secuence = req.body.secuence;
		var data = await secuences.getSecuence(secuence);
		
		if (req.files && Object.keys(req.files).length > 0){
			var image = req.files.image
			img_id = (await uploader(image.tempFilePath)).public_id;
		}
		if (await secuences.changeImage(secuence, img_id) && admin) {
			res.redirect('back')
			
		}else{
			console.log(2);
			var data = await secuences.getSecuence(secuence);
			var solves = await solutions.getSolutions(secuence);
			var recents = await secuences.lastSecuences();
			res.render('secuencePage',{
				data,
				recents,
				solves,
				layout:'layout',
				admin,
				error:true,
				message:'There was an error'
			})
		}
	}catch(error){
		console.log(error);
	}



})

module.exports = router;