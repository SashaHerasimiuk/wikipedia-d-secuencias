var pool = require('./dataBase');


async function createSecuence(name, secuence, description, id_img){
	try{
		var query = 'insert into secuences (requester, secuence, description, id_img) values (?, ?, ?, ?)';
		await pool.query(query, [name, secuence, description, id_img]);
		return false;
	}catch (error){
		console.log(error, 'createSecuence');
		return true;
	}
}

async function lastSecuences(){
	try {
		var query = 'select secuence, requester, solution from secuences order by secuence_id desc limit 10';
		return await pool.query(query);
	}catch (error){
		console.log(error, 'lastSecuences');
	}
}

async function getSecuences(){
	try {
		var query = 'select * from secuences order by secuence_id desc';
		return await pool.query(query);
	}catch (error){
		console.log(error, 'getSecuences');
	}
}

async function deleteSecuence(secuence){
	try {
		var query = 'delete from secuences where secuence = ?';
		await pool.query(query,[secuence]);		
	}catch (error){
		console.log(error, 'deleteSecuence')
	}
}

async function selectSolution(secuence, solution){
	try {
		var query = 'update secuences set solution = ? where secuence = ?';
		await pool.query(query,[solution, secuence])
	}catch (error){
		console.log(error, 'selectSolution');
	}
}

async function getSecuence(secuence){
	try {
		var query = 'select * from secuences where secuence = ?';
		var row =  await pool.query(query, [secuence]);
		return row[0];
	}catch (error){
		console.log(error, 'getSecuence');
	}
}

async function search(secuence){
	try {
		var query = "select * from secuences where secuence LIKE ?";
		var result = await pool.query(query, '%'+[secuence]+'%');
		return result
	}catch (error){
		console.log(error);
	}
}

async function changeDescription(secuence, description){
	try{
		var query = 'update secuences set description=? where secuence=?';
		await pool.query(query,[description, secuence]);
	}catch(error){
		console.log(error);
	}
}

async function changeImage(secuence, img_id){
	try{
		var query = 'update secuences set id_img=? where secuence=?';
		await pool.query(query,[img_id, secuence]);
		return true;
	}catch(error){
		console.log(error);
		return false;
	}
}






module.exports = {
	createSecuence, getSecuence, getSecuences, deleteSecuence, selectSolution, lastSecuences, search, changeDescription, changeImage
}