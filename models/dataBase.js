var mysql = require('mysql');
var util = require('util');
require('dotenv').config();

var pool = mysql.createPool({
	connectionLimit:10,
	host:process.env.DB_HOST,
	user:process.env.DB_USER,
	password:process.env.DB_PASSWORD,
	database:process.env.DB_NAME
});

pool.query = util.promisify(pool.query);

module.exports = pool;