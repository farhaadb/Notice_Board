function start(host, db, usr, pwd)
{
	var mysql = require("mysql");

	var pool = mysql.createPool({
	host     : host,
	database : db,
	user     : usr,
	password : pwd
	});
	
	return pool;
}

exports.start = start;