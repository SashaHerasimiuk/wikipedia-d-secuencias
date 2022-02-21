var pool = require('./dataBase');


async function getSolutions(secuence){
	try{
		var query = 'select * from solutions where secuence = ? order by solution_id';
		var rows = await pool.query(query,[secuence]);
		return rows;
		console.log(rows);
	}catch(error){
		console.log(error);
	}
}

async function createSolution(secuence, solution, username){
	try{
		var query = 'insert into solutions (requester, secuence, solveTry) values (?, ?, ?)';
		await pool.query(query,[username, secuence, solution]);
	}catch(error){
		console.log(error);
	}
}

module.exports = {getSolutions, createSolution}