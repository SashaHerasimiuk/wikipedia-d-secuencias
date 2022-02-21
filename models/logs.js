var pool = require('./dataBase');

async function getLogs(){
	var query = 'select * from changelog order by log_id desc'
	return await pool.query(query);
}

async function createLog(req, username, change){
	var time = require('moment')().format('YYYY-MM-DD HH-mm-ss');
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var query = 'insert into changelog (time, ip, username, changes) values (?, ?, ?, ?)';
	await pool.query(query,[time, ip.substring('::ffff:'.length), username, change]);
}

module.exports = {getLogs, createLog}