var router = require('express').Router();
var secuences = require('../../models/secuences');
var logs = require('../../models/logs');

var cloudinary = require('cloudinary').v2;
var util = require('util');

const uploader = util.promisify(cloudinary.uploader.upload)


router.get('/',async (req, res, next)=>{
	var recents = secuences.lastSecuences();

	res.render('user/createSecuence',{
		layout:'layout',
		recents
	})
})


router.get('/create', async function(req, res, next){
	var recents = secuences.lastSecuences();
	var number = true;
	var cant = []
	var error = false;
	var message = '';
	for( var i = 0; i < req.query.cant; i++){
		cant[i] = i;
	}
	if (req.query.cant < 4 || req.query.cant > 20) {
		error=true;
		message = 'the number of terms need to be between 4 and 20';
		res.render('user/createSecuence',{
			recents,
			layout:'layout',
			error,
			message
		});
	}else{
		res.render('user/createSecuence',{
		recents,
		layout:'layout',
		cant,
		number
		});
	}
	
})

router.post('/create', async function(req, res, next){
	

	try{
		var recents = secuences.lastSecuences();
		var toJoin = req.body.term;
		var error = false;
		var message = '';

		


		for (var i = 0; i < toJoin.length; i++){
			if (toJoin[i] == ''){
				error = true;
				message = 'all camps must be filled';
			}
		}
		if(error){
			res.render('user/createSecuence',{
			layout:'layout',
			error,
			message
		})
		}else{
			var img_id = '';
				if (req.files && Object.keys(req.files).length > 0){
				var image = req.files.image
				img_id = (await uploader(image.tempFilePath)).public_id;
				console.log(img_id)
			}
			var secuence = toJoin.join();
			var description = req.body.description;
			if (await secuences.createSecuence(req.session.username, secuence, description, img_id)) {
				await logs.createLog(req, req.session.username, 'tried to create duplicate secuence:' + secuence);
				res.render('user/createSecuence',{
					layout:'layout',
					error:true,
					message:'secuence already on database'
				})
			}else{
				await logs.createLog(req, req.session.username, 'created secuence:' + secuence);
				res.redirect('/');
			}
		}
	}catch (error){
		console.log(error);
	}

	
	
})

module.exports = router;