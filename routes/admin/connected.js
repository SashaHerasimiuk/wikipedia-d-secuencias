var router = require('express').Router();
var secuences = require('../../models/secuences');

router.get('/', async function(req, res, next){
	var recents = await secuences.lastSecuences();
	res.render('admin/connected',{
		layout:'layout',
		recents,
		admin:req.session.username
	});
});

module.exports = router;