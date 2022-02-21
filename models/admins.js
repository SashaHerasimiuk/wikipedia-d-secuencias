var pool = require('./dataBase');

async function proveAdmin(username){
	try{
		var query = 'select * from admins where admin = ? limit 1';
		var row = await pool.query(query,[username]);
		if (row.length != 0){
			return true;
		}else{
			return false;
		}
	}catch(error){
		console.log(error);
	}
}

async function makeAdmin(username){
	try {
		var query = 'insert into admins (admin) values (?)';
		await pool.query(query,[username])
	}catch	(error){
		console.log(error);
	}
}

async function revokeAdmin(username){
	try {
		if (username !='sasha') {
			var query = 'delete from admins where admin = ?';
			await pool.query(query,[username]);
		}else{}
	}catch (error){
		console.log(error);
	}
}

module.exports ={proveAdmin, makeAdmin, revokeAdmin}

