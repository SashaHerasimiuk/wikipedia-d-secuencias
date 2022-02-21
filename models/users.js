var pool = require('./dataBase');
var md5 = require('md5');

async function createUser(username, password, email){
	try {
		var proveName = await usernameTaken(username);
		var proveEmail = await emailTaken(email);
		if(proveName){
			return[true, 'Username taken'];
		}else if(proveEmail){
			return[true, 'Email taken']
		}else{
			var query = 'insert into users (username, password, email) values (?,?,?)';
			await pool.query(query,[username, md5(password), email]);
			return [false,'']
		}
	}catch(error){
		console.log(error);
	}
}

async function emailTaken(email){
	try{
		var query = 'select * from users where email = ?';
		var row = await pool.query(query,[email]);
		if(row.length == 0){
			return false;
		}else{
			return true;
		}
	}catch (error){
		console.log(error)
		return true;
	}
}

async function usernameTaken(username){
	try {
		var query = 'select * from users where username = ?';
		var row = await pool.query(query,[username])
		if (row.length == 0) {
			return false;

		}else{
			return true;
		}
	}catch (error){
		console.log(error);
		return true;
	}
}

async function getUser(user,password){
	try {
		var query = 'select * from users where username = ? and password = ?';
		var row = await pool.query(query, [user,md5(password)]);
		return row[0];
	}catch(error){
		console.log(error);
	}
}

async function getUsers(){
	try{
		var query = 'select username, email from users'
		return await pool.query(query);
	}catch(error){
		console.log(error);
	}
}

module.exports = {createUser, getUser, usernameTaken, emailTaken, getUsers}