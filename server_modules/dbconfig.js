function start(host, db, usr, pwd)
{
	var mysql = require("mysql");

	var connection = mysql.createConnection({
	host     : host,
	database : db,
	user     : usr,
	password : pwd
	});
	
	return connection;
}

exports.start = start;