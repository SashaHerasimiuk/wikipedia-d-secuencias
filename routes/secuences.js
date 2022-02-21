var router = require('express').Router();
var secuences = require('../models/secuences');

router.get('/', async function(req, res, next){
	try {
		var list = await secuences.getSecuences();
		res.render('secuences',{
			list,
			layout:'layout'
		});
	}catch (error){
		console.log(error, 'secuences.js')
	}
})

router.get('/search', async (req, res, next)=>{
	var search = req.query.search;
	if (search != ''){
		try {	
			var list = await secuences.search(search);
			res.render('secuences',{
				layout:'layout',
				list
			});
		}catch (error){
			console.log(error);
		}
	}else{
		res.redirect('/secuences');
	}
})

module.exports = router;